"use client";

import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Package,
  FileText,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Tổng sản phẩm",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: Package,
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Hàng sắp hết",
    value: "8",
    change: "-2",
    trend: "down",
    icon: AlertTriangle,
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Hóa đơn nhập",
    value: "24",
    change: "+5",
    trend: "up",
    icon: FileText,
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Hóa đơn bán",
    value: "189",
    change: "+23%",
    trend: "up",
    icon: ShoppingCart,
    bgColor: "bg-violet-50 dark:bg-violet-950/50",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "import",
    message: "Nhập 50 sản phẩm từ nhà cung cấp",
    time: "5 phút trước",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    id: 2,
    type: "sale",
    message: "Bán hàng #INV-2024-189",
    time: "15 phút trước",
    icon: ShoppingCart,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    id: 3,
    type: "alert",
    message: "Sản phẩm 'Mì Hảo Hảo' sắp hết hàng",
    time: "30 phút trước",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
  },
  {
    id: 4,
    type: "product",
    message: "Thêm sản phẩm mới: Nước ngọt Coca",
    time: "1 giờ trước",
    icon: Package,
    color: "text-violet-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/50",
  },
];

const topProducts = [
  { name: "Mì Hảo Hảo", sold: 150, revenue: "2,250,000đ" },
  { name: "Nước ngọt Coca", sold: 120, revenue: "1,800,000đ" },
  { name: "Bánh Oreo", sold: 85, revenue: "1,275,000đ" },
  { name: "Sữa tươi Vinamilk", sold: 75, revenue: "1,125,000đ" },
];

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Chào mừng bạn đến với hệ thống quản lý cửa hàng
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/import">
                <FileText className="mr-2 h-4 w-4" />
                Nhập hàng
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/sales">
                <Plus className="mr-2 h-4 w-4" />
                Bán hàng
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards - Clean, no borders */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-semibold">{stat.value}</span>
                    <span className={`text-xs flex items-center gap-0.5 ${
                      stat.trend === "up" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content - Two columns */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activities - Clean list */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium flex items-center gap-2">
                Hoạt động gần đây
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                <Link href="/activities">
                  Xem tất cả
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-1">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <div className={`p-2.5 rounded-xl ${activity.bgColor}`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium">Sản phẩm bán chạy</h2>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                <Link href="/products">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sold} đã bán
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {product.revenue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions - Large touch-friendly cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/import"
            className="group bg-card rounded-2xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">Nhập hàng mới</h3>
                <p className="text-sm text-muted-foreground">
                  Tải ảnh hóa đơn lên để AI nhận diện
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/sales"
            className="group bg-card rounded-2xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
                <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">Bán hàng</h3>
                <p className="text-sm text-muted-foreground">
                  Tạo hóa đơn bán hàng mới
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/ai-ocr"
            className="group bg-card rounded-2xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/50">
                <Package className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">AI OCR</h3>
                <p className="text-sm text-muted-foreground">
                  Quản lý và thử nghiệm AI nhận diện
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
