import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `PN-${year}${month}${day}-${random}`;
}

function generateSku(name: string) {
  const prefix = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, 3);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix || "PRO"}-${random}`;
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Date.now().toString(36);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const supplierId = searchParams.get("supplierId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { supplier: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [invoices, total] = await Promise.all([
      prisma.importInvoice.findMany({
        where,
        include: {
          supplier: {
            select: { id: true, name: true },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, sku: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.importInvoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching import invoices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { supplierId, notes, items, status = "COMPLETED" } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Danh sách sản phẩm không được trống" },
        { status: 400 }
      );
    }

    // Validate items - chỉ yêu cầu productName, quantity, unitPrice
    for (const item of items) {
      if (!item.productName || item.quantity <= 0 || item.unitPrice <= 0) {
        return NextResponse.json(
          { error: "Thông tin sản phẩm không hợp lệ" },
          { status: 400 }
        );
      }
    }

    const invoiceNumber = generateInvoiceNumber();

    // Create invoice with items and update product stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const preparedItems = [];

      for (const item of items) {
        const itemTotal = item.quantity * item.unitPrice;
        totalAmount += itemTotal;

        let productId = item.productId;
        let previousUnitPrice = null;

        // Nếu không có productId, tìm hoặc tạo sản phẩm mới
        if (!productId) {
          // Tìm sản phẩm theo tên (case insensitive)
          let product = await tx.product.findFirst({
            where: {
              name: {
                equals: item.productName,
                mode: "insensitive",
              },
            },
          });

          // Nếu không tìm thấy, tạo sản phẩm mới
          if (!product) {
            product = await tx.product.create({
              data: {
                name: item.productName,
                sku: generateSku(item.productName),
                slug: generateSlug(item.productName),
                importPrice: item.unitPrice,
                sellPrice: item.unitPrice * 1.3, // Giá bán = giá nhập * 1.3
                stock: 0,
                minStock: 10,
              },
            });
          } else {
            // Lưu giá cũ trước khi cập nhật
            previousUnitPrice = product.importPrice;
          }

          productId = product.id;
        } else {
          // Lấy sản phẩm hiện tại để lưu giá cũ
          const product = await tx.product.findUnique({
            where: { id: productId },
          });
          if (product) {
            previousUnitPrice = product.importPrice;
          }
        }

        preparedItems.push({
          productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          previousUnitPrice,
          totalPrice: itemTotal,
        });

        // Cập nhật tồn kho và giá nhập
        await tx.product.update({
          where: { id: productId },
          data: {
            stock: { increment: item.quantity },
            previousImportPrice: previousUnitPrice,
            importPrice: item.unitPrice,
          },
        });
      }

      // Create import invoice
      const importInvoice = await tx.importInvoice.create({
        data: {
          invoiceNumber,
          supplierId: supplierId || null,
          totalAmount,
          notes,
          status,
          createdById: (session.user as any).id,
          items: {
            create: preparedItems,
          },
        },
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return importInvoice;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating import invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
