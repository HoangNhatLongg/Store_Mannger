import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: {
      email: "admin@store.com",
      password: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create staff user
  const staffPassword = await bcrypt.hash("staff123", 10);
  const staff = await prisma.user.upsert({
    where: { email: "staff@store.com" },
    update: {},
    create: {
      email: "staff@store.com",
      password: staffPassword,
      name: "Nhân viên",
      role: "STAFF",
    },
  });
  console.log("Created staff user:", staff.email);

  // Create categories
  const categories = [
    { name: "Mì ăn liền", slug: "mi-an-lien", description: "Các loại mì ăn liền" },
    { name: "Nước giải khát", slug: "nuoc-giai-khat", description: "Nước ngọt, nước suối" },
    { name: "Bánh kẹo", slug: "banh-keo", description: "Bánh, kẹo các loại" },
    { name: "Sữa", slug: "sua", description: "Sữa tươi, sữa hộp" },
    { name: "Bia", slug: "bia", description: "Bia lon, bia chai" },
    { name: "Cà phê", slug: "ca-phe", description: "Cà phê hòa tan, cà phê lon" },
    { name: "Dầu ăn", slug: "dau-an", description: "Dầu ăn các loại" },
    { name: "Gạo", slug: "gao", description: "Gạo các loại" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Created categories:", categories.length);

  // Create default units
  const units = [
    { name: "Cái", abbreviation: "cái", isBaseUnit: true },
    { name: "Lon", abbreviation: "lon", isBaseUnit: true },
    { name: "Chai", abbreviation: "chai", isBaseUnit: true },
    { name: "Gói", abbreviation: "gói", isBaseUnit: true },
    { name: "Hộp", abbreviation: "hộp", isBaseUnit: true },
    { name: "Túi", abbreviation: "túi", isBaseUnit: true },
    { name: "Thùng", abbreviation: "thùng", isBaseUnit: false },
    { name: "Kg", abbreviation: "kg", isBaseUnit: true },
    { name: "Lít", abbreviation: "lít", isBaseUnit: true },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { abbreviation: unit.abbreviation },
      update: {},
      create: unit,
    });
  }
  console.log("Created units:", units.length);

  // Create products
  const categoryList = await prisma.category.findMany();
  const products = [
    // Mì ăn liền
    { name: "Mì Hảo Hảo tôm", sku: "MI001", importPrice: 4500, sellPrice: 6000, stock: 150, categorySlug: "mi-an-lien" },
    { name: "Mì Hảo Hảo beef", sku: "MI002", importPrice: 5000, sellPrice: 7000, stock: 120, categorySlug: "mi-an-lien" },
    { name: "Mì Omachi", sku: "MI003", importPrice: 7000, sellPrice: 10000, stock: 80, categorySlug: "mi-an-lien" },
    
    // Nước giải khát
    { name: "Nước ngọt Coca", sku: "NC001", importPrice: 12000, sellPrice: 15000, stock: 100, categorySlug: "nuoc-giai-khat" },
    { name: "Nước ngọt Pepsi", sku: "NC002", importPrice: 11000, sellPrice: 14000, stock: 90, categorySlug: "nuoc-giai-khat" },
    { name: "Nước suối Lavie", sku: "NS001", importPrice: 3000, sellPrice: 5000, stock: 200, categorySlug: "nuoc-giai-khat" },
    { name: "Nước suối Vinamilk", sku: "NS002", importPrice: 3500, sellPrice: 6000, stock: 150, categorySlug: "nuoc-giai-khat" },
    
    // Bánh kẹo
    { name: "Bánh Oreo", sku: "BO001", importPrice: 12000, sellPrice: 15000, stock: 75, categorySlug: "banh-keo" },
    { name: "Bánh KitKat", sku: "BK001", importPrice: 10000, sellPrice: 13000, stock: 60, categorySlug: "banh-keo" },
    { name: "Kẹo sữa", sku: "KS001", importPrice: 5000, sellPrice: 8000, stock: 100, categorySlug: "banh-keo" },
    
    // Sữa
    { name: "Sữa tươi Vinamilk 180ml", sku: "SV001", importPrice: 8000, sellPrice: 12000, stock: 80, categorySlug: "sua" },
    { name: "Sữa hộp Vinamilk", sku: "SV002", importPrice: 14000, sellPrice: 18000, stock: 50, categorySlug: "sua" },
    { name: "Sữa chua Vinamilk", sku: "SC001", importPrice: 6000, sellPrice: 9000, stock: 60, categorySlug: "sua" },
    
    // Bia
    { name: "Bia Tiger lon", sku: "BT001", importPrice: 18000, sellPrice: 25000, stock: 100, categorySlug: "bia" },
    { name: "Bia Heineken lon", sku: "BH001", importPrice: 22000, sellPrice: 30000, stock: 60, categorySlug: "bia" },
    
    // Cà phê
    { name: "Cà phê G7", sku: "CG001", importPrice: 3000, sellPrice: 5000, stock: 200, categorySlug: "ca-phe" },
    { name: "Cà phê wake-up", sku: "CW001", importPrice: 2500, sellPrice: 4000, stock: 150, categorySlug: "ca-phe" },
    
    // Dầu ăn
    { name: "Dầu ăn Meizan", sku: "DM001", importPrice: 30000, sellPrice: 38000, stock: 40, categorySlug: "dau-an" },
    { name: "Dầu ăn Simply", sku: "DS001", importPrice: 35000, sellPrice: 42000, stock: 35, categorySlug: "dau-an" },
    
    // Gạo
    { name: "Gạo ST25", sku: "GS001", importPrice: 25000, sellPrice: 35000, stock: 100, categorySlug: "gao" },
    { name: "Gạo Thơm Hương", sku: "GH001", importPrice: 18000, sellPrice: 25000, stock: 150, categorySlug: "gao" },
  ];

  for (const product of products) {
    const category = categoryList.find((c) => c.slug === product.categorySlug);
    if (category) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: {
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, "-"),
          sku: product.sku,
          importPrice: product.importPrice,
          sellPrice: product.sellPrice,
          stock: product.stock,
          categoryId: category.id,
          minStock: 10,
        },
      });
    }
  }
  console.log("Created products:", products.length);

  // Create settings
  const settings = [
    { key: "store_name", value: "Cửa hàng tiện lợi ABC", group: "general", isPublic: true },
    { key: "currency", value: "VND", group: "general", isPublic: true },
    { key: "ai_model", value: "gpt-4o", group: "ai", isPublic: false },
    { key: "low_stock_threshold", value: "10", group: "inventory", isPublic: false },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("Created settings:", settings.length);

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
