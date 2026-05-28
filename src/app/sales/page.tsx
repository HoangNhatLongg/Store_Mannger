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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Minus, ShoppingCart } from "lucide-react";

const products = [
  { id: "1", name: "Mì Hảo Hảo", price: 6000, stock: 150 },
  { id: "2", name: "Nước ngọt Coca", price: 15000, stock: 80 },
  { id: "3", name: "Bánh Oreo", price: 15000, stock: 45 },
  { id: "4", name: "Sữa tươi Vinamilk", price: 18000, stock: 60 },
  { id: "5", name: "Bia Tiger lon", price: 25000, stock: 100 },
  { id: "6", name: "Cà phê G7", price: 5000, stock: 200 },
  { id: "7", name: "Nước suối Lavie", price: 5000, stock: 300 },
  { id: "8", name: "Bánh KitKat", price: 12000, stock: 75 },
  { id: "9", name: "Mít sấy", price: 25000, stock: 40 },
  { id: "10", name: "Trứng gà", price: 5000, stock: 120 },
  { id: "11", name: "Dầu ăn Meizan", price: 35000, stock: 50 },
  { id: "12", name: "Gạo Thơm", price: 18000, stock: 200 },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleCompletePayment = () => {
    setCart([]);
    setIsPaymentDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Bán hàng</h1>
          <p className="text-muted-foreground mt-1">
            Tạo hóa đơn và xử lý thanh toán
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Products Grid */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 bg-card rounded-xl border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-card rounded-2xl p-4 text-left hover:shadow-md hover:bg-muted/50 transition-all group"
                >
                  <div className="aspect-square rounded-xl bg-muted/50 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <span className="text-2xl font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-primary font-semibold mt-1">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Còn {product.stock}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-card rounded-2xl p-6 h-fit sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Giỏ hàng
              </h2>
              {cart.length > 0 && (
                <Badge variant="secondary">{cart.length} sản phẩm</Badge>
              )}
            </div>

            {cart.length > 0 ? (
              <>
                {/* Cart Items */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="text-muted-foreground">
                      {totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                {/* Payment Button */}
                <Button className="w-full rounded-xl" size="lg" onClick={handlePayment}>
                  Thanh toán
                </Button>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Giỏ hàng trống</p>
                <p className="text-sm">Chọn sản phẩm để thêm vào giỏ</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="rounded-2xl sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Thanh toán</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tổng tiền</p>
                <p className="text-4xl font-bold text-primary">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Tiền khách đưa</Label>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    className="rounded-xl text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Input placeholder="Ghi chú (tùy chọn)" className="rounded-xl" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="rounded-xl">
                Hủy
              </Button>
              <Button onClick={handleCompletePayment} className="rounded-xl">
                Hoàn thành
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
