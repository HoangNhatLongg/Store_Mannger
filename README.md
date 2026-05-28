# Store Manager - AI Grocery Store Management System

Hệ thống quản lý cửa hàng tạp hóa với tích hợp AI OCR.

> **Dự án học tập** - Xây dựng hệ thống quản lý cửa hàng tạp hóa với các tính năng hiện đại và tích hợp AI.

## Thông tin dự án

| Thông tin | Chi tiết |
|-----------|----------|
| **Tên dự án** | Store Manager |
| **Phiên bản** | 1.0.0 |
| **Framework** | Next.js 15 + TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **UI Library** | TailwindCSS v4 + Shadcn UI |
| **Trạng thái** | Đang phát triển |

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS v4, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM 5.x
- **AI OCR**: 9Router API (GPT-4o, Claude, Gemini, Mistral)
- **Authentication**: NextAuth.js
- **Container**: Docker & Docker Compose

## Tính năng

- [x] Dashboard với thống kê
- [x] Quản lý sản phẩm (CRUD)
- [x] Quản lý danh mục
- [x] Quản lý nhập hàng (với AI OCR)
- [x] Quản lý bán hàng (POS)
- [x] Quản lý tồn kho
- [x] AI OCR nhận diện hóa đơn (9Router)
- [x] Hỗ trợ nhiều AI Model
- [x] Responsive UI với Dark Mode
- [x] Audit Log theo dõi thay đổi

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (khuyến nghị)
- PostgreSQL (hoặc dùng Docker)

### Cài đặt nhanh với Docker

```bash
# 1. Khởi động PostgreSQL và pgAdmin
docker-compose up -d

# 2. Cài đặt dependencies
npm install

# 3. Copy và cập nhật .env
cp .env.example .env
# Chỉnh sửa DATABASE_URL nếu cần

# 4. Generate Prisma Client
npm run db:generate

# 5. Push schema xuống database
npm run db:push

# 6. Seed database (tùy chọn)
npm run db:seed

# 7. Khởi động dev server
npm run dev
```

### Cài đặt thủ công (không Docker)

```bash
# 1. Cài PostgreSQL trên máy
# 2. Tạo database: store_manager

# 3. Cài đặt dependencies
npm install

# 4. Copy và cập nhật .env
cp .env.example .env
# Cập nhật DATABASE_URL phù hợp với PostgreSQL của bạn

# 5. Generate Prisma Client
npm run db:generate

# 6. Run migrations
npm run db:migrate

# 7. Khởi động dev server
npm run dev
```

### Truy cập

- **App**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
  - Email: admin@store.com
  - Password: admin123

## Database Commands

```bash
npm run db:generate   # Generate Prisma Client
npm run db:push       # Push schema to database (dev)
npm run db:migrate    # Run migrations (production)
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed database with sample data
```

## Docker Configuration

File `docker-compose.yml` chứa:

- **PostgreSQL 16**: Database chính
  - Port: 5432
  - User: store_admin
  - Password: store_password
  - Database: store_manager

- **pgAdmin 4**: Quản lý database GUI
  - Port: 5050
  - Email: admin@store.com
  - Password: admin123

### Quản lý Docker

```bash
# Khởi động
docker-compose up -d

# Dừng
docker-compose down

# Xóa volumes (reset database)
docker-compose down -v
```

## Project Structure

```
store-manager/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Dashboard
│   │   ├── products/          # Products management
│   │   ├── categories/        # Categories management
│   │   ├── import/            # Import invoices
│   │   ├── sales/            # Sales POS
│   │   ├── inventory/        # Inventory management
│   │   ├── ai-ocr/           # AI OCR settings
│   │   ├── settings/          # App settings
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   └── layout/           # Layout components
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Utilities
│   ├── services/             # Business logic
│   └── types/                # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
├── docs/
│   └── database.md           # Database documentation
├── docker-compose.yml        # Docker configuration
└── package.json
```

## Database Schema

Xem chi tiết tại [docs/database.md](./docs/database.md)

### Entities chính:

| Entity | Mô tả |
|--------|--------|
| User | Người dùng hệ thống |
| Category | Danh mục sản phẩm |
| Product | Sản phẩm |
| Supplier | Nhà cung cấp |
| Customer | Khách hàng |
| ImportInvoice | Hóa đơn nhập hàng |
| ImportInvoiceItem | Chi tiết nhập hàng |
| SaleInvoice | Hóa đơn bán hàng |
| SaleInvoiceItem | Chi tiết bán hàng |
| Setting | Cài đặt hệ thống |
| AuditLog | Nhật ký hệ thống |

## Scripts

```bash
npm run dev          # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://store_admin:store_password@localhost:5432/store_manager"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# 9Router AI OCR
NINEROUTER_API_KEY=""

# Default AI Model
DEFAULT_AI_MODEL="gpt-4o"
```

## License

MIT
