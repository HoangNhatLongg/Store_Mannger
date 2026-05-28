"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
} from "lucide-react";

const inventoryStats = [
  {
    title: "Tổng sản phẩm",
    value: "156",
    icon: Package,
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Sắp hết hàng",
    value: "8",
    icon: AlertTriangle,
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Hàng tăng giá",
    value: "3",
    icon: TrendingUp,
    bgColor: "bg-red-50 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    title: "Hàng giảm giá",
    value: "5",
    icon: TrendingDown,
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const inventoryData = [
  { id: "1", name: "Mì Hảo Hảo", sku: "MI001", stock: 150, minStock: 20, status: "normal", category: "Mì ăn liền" },
  { id: "2", name: "Nước ngọt Coca", sku: "NC001", stock: 80, minStock: 30, status: "normal", category: "Nước giải khát" },
  { id: "3", name: "Bánh Oreo", sku: "BO001", stock: 45, minStock: 50, status: "low", category: "Bánh kẹo" },
  { id: "4", name: "Sữa tươi Vinamilk", sku: "SV001", stock: 60, minStock: 25, status: "normal", category: "Sữa" },
  { id: "5", name: "Bia Tiger lon", sku: "BT001", stock: 100, minStock: 40, status: "normal", category: "Bia" },
  { id: "6", name: "Cà phê G7", sku: "CG001", stock: 15, minStock: 30, status: "low", category: "Cà phê" },
  { id: "7", name: "Nước suối Lavie", sku: "NS001", stock: 300, minStock: 50, status: "normal", category: "Nước giải khát" },
  { id: "8", name: "Bánh KitKat", sku: "BK001", stock: 75, minStock: 20, status: "normal", category: "Bánh kẹo" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Tồn kho</h1>
            <p className="text-muted-foreground mt-1">
              Theo dõi và quản lý hàng tồn kho
            </p>
          </div>
          <Button variant="outline" className="rounded-full">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {inventoryStats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 bg-muted/50 rounded-xl border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className="rounded-xl"
            >
              Tất cả
            </Button>
            <Button
              variant={filterStatus === "normal" ? "default" : "outline"}
              onClick={() => setFilterStatus("normal")}
              className="rounded-xl"
            >
              Còn hàng
            </Button>
            <Button
              variant={filterStatus === "low" ? "default" : "outline"}
              onClick={() => setFilterStatus("low")}
              className="rounded-xl"
            >
              Sắp hết
            </Button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-center">Tồn kho</TableHead>
                <TableHead className="text-center">Tối thiểu</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.stock}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {item.minStock}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={item.status === "normal" ? "success" : "warning"}
                    >
                      {item.status === "normal" ? "Còn hàng" : "Sắp hết"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
