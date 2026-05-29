import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, sku, categoryId, importPrice, sellPrice, stock, minStock, description, image, imageUrl } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const duplicateCheck = await prisma.product.findFirst({
      where: {
        OR: [{ sku }, { name }],
        NOT: { id },
      },
    });

    if (duplicateCheck) {
      return NextResponse.json(
        { error: "SKU hoặc tên sản phẩm đã tồn tại" },
        { status: 400 }
      );
    }

    const slug = name
      ? name.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : existingProduct.slug;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        sku,
        categoryId,
        importPrice: importPrice !== undefined ? parseFloat(importPrice) : undefined,
        sellPrice: sellPrice !== undefined ? parseFloat(sellPrice) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        minStock: minStock !== undefined ? parseInt(minStock) : undefined,
        description,
        imageUrl: imageUrl || image || null,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { importItems: true, saleItems: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Kiểm tra nếu có giao dịch bán hàng thì không cho xóa
    if (existingProduct.saleItems.length > 0) {
      return NextResponse.json(
        { error: "Sản phẩm đã có trong hóa đơn bán hàng, không thể xóa" },
        { status: 400 }
      );
    }

    // Xóa các import invoice items trước (nếu có)
    if (existingProduct.importItems.length > 0) {
      await prisma.importInvoiceItem.deleteMany({
        where: { productId: id },
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
