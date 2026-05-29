import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/product-units - Lấy danh sách product-units (có thể filter theo productId)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId là bắt buộc" },
        { status: 400 }
      );
    }

    const productUnits = await prisma.productUnit.findMany({
      where: { productId },
      include: {
        unit: true,
      },
      orderBy: [
        { isDefault: "desc" },
        { conversionQty: "asc" },
      ],
    });

    return NextResponse.json(productUnits);
  } catch (error) {
    console.error("Error fetching product units:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/product-units - Thêm đơn vị cho sản phẩm
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, unitId, conversionQty, price, isDefault } = body;

    if (!productId || !unitId || price === undefined) {
      return NextResponse.json(
        { error: "productId, unitId và price là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Kiểm tra đơn vị tồn tại
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!unit) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn vị" },
        { status: 404 }
      );
    }

    // Kiểm tra đã có chưa
    const existing = await prisma.productUnit.findUnique({
      where: {
        productId_unitId: {
          productId,
          unitId,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Sản phẩm đã có đơn vị này" },
        { status: 400 }
      );
    }

    // Nếu là default, bỏ default của các đơn vị khác
    if (isDefault) {
      await prisma.productUnit.updateMany({
        where: { productId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const productUnit = await prisma.productUnit.create({
      data: {
        productId,
        unitId,
        conversionQty: conversionQty || 1,
        price: parseFloat(price),
        isDefault: isDefault || false,
      },
      include: {
        unit: true,
      },
    });

    return NextResponse.json(productUnit, { status: 201 });
  } catch (error) {
    console.error("Error creating product unit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/product-units - Cập nhật product-unit
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, conversionQty, price, isDefault } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id là bắt buộc" },
        { status: 400 }
      );
    }

    const existing = await prisma.productUnit.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy product-unit" },
        { status: 404 }
      );
    }

    // Nếu là default, bỏ default của các đơn vị khác
    if (isDefault && !existing.isDefault) {
      await prisma.productUnit.updateMany({
        where: { productId: existing.productId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const productUnit = await prisma.productUnit.update({
      where: { id },
      data: {
        conversionQty: conversionQty !== undefined ? conversionQty : existing.conversionQty,
        price: price !== undefined ? parseFloat(price) : existing.price,
        isDefault: isDefault !== undefined ? isDefault : existing.isDefault,
      },
      include: {
        unit: true,
      },
    });

    return NextResponse.json(productUnit);
  } catch (error) {
    console.error("Error updating product unit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/product-units - Xóa product-unit
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id là bắt buộc" },
        { status: 400 }
      );
    }

    const existing = await prisma.productUnit.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy product-unit" },
        { status: 404 }
      );
    }

    await prisma.productUnit.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Error deleting product unit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
