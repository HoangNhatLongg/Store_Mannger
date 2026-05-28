"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  History,
  Bot,
  Save,
  Search,
  Package,
} from "lucide-react";
import Link from "next/link";

interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  importPrice: string;
}

interface ImportItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface SimilarProduct {
  id: string;
  name: string;
  sku: string;
  importPrice: string;
}

export default function ImportPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state - chỉ dùng string để đơn giản
  const [supplierId, setSupplierId] = useState<string>("");
  const [items, setItems] = useState<ImportItem[]>([
    { id: "1", productId: null, productName: "", quantity: 1, unitPrice: 0 }
  ]);

  // Dialog state
  const [showSimilarDialog, setShowSimilarDialog] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [tempItemId, setTempItemId] = useState<string>("");
  const [tempProductName, setTempProductName] = useState("");

  // Fetch data
  useState(() => {
    fetchData();
  });

  async function fetchData() {
    setIsLoading(true);
    try {
      const [suppliersRes, productsRes] = await Promise.all([
        fetch("/api/suppliers"),
        fetch("/api/products?limit=1000")
      ]);
      
      const suppliersData = await suppliersRes.json();
      const productsData = await productsRes.json();
      
      if (Array.isArray(suppliersData)) {
        setSuppliers(suppliersData);
      }
      if (productsData.products && Array.isArray(productsData.products)) {
        setProducts(productsData.products);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function addRow() {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), productId: null, productName: "", quantity: 1, unitPrice: 0 }
    ]);
  }

  function removeRow(id: string) {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }

  function updateItemName(id: string, name: string) {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      // Tìm exact match
      const match = products.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (match) {
        return { ...item, productName: name, productId: match.id, unitPrice: parseFloat(match.importPrice) || 0 };
      }
      return { ...item, productName: name, productId: null };
    }));
  }

  function updateItemQuantity(id: string, qty: number) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: qty } : item
    ));
  }

  function updateItemPrice(id: string, price: number) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, unitPrice: price } : item
    ));
  }

  function getTotal() {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  function handleSubmit() {
    const validItems = items.filter(item => item.productName.trim() !== "");
    
    if (validItems.length === 0) {
      alert("Vui lòng nhập ít nhất một sản phẩm");
      return;
    }

    for (const item of validItems) {
      if (item.quantity <= 0) {
        alert("Số lượng phải lớn hơn 0");
        return;
      }
      if (item.unitPrice <= 0) {
        alert("Đơn giá phải lớn hơn 0");
        return;
      }
    }

    // Kiểm tra sản phẩm chưa được chọn
    const uncheckedItems = validItems.filter(item => !item.productId);
    if (uncheckedItems.length > 0) {
      // Tìm sản phẩm tương tự cho item đầu tiên
      const first = uncheckedItems[0];
      const query = first.productName.toLowerCase();
      const similar = products
        .filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query))
        .slice(0, 5);

      if (similar.length > 0) {
        setTempItemId(first.id);
        setTempProductName(first.productName);
        setSimilarProducts(similar);
        setShowSimilarDialog(true);
        return;
      }
    }

    // Submit
    submitImport(validItems);
  }

  async function submitImport(validItems: ImportItem[]) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: supplierId || null,
          items: validItems.map(item => ({
            productId: item.productId || undefined,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          status: "COMPLETED",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Có lỗi xảy ra");
        return;
      }

      const data = await res.json();
      alert("Nhập hàng thành công!");
      router.push(`/import/${data.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  }

  function selectSimilarProduct(product: SimilarProduct) {
    setItems(prev => prev.map(item =>
      item.id === tempItemId
        ? { ...item, productId: product.id, productName: product.name, unitPrice: parseFloat(product.importPrice) || 0 }
        : item
    ));
    setShowSimilarDialog(false);
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/import/history">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-semibold">Nhập hàng</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl">
              <Bot className="mr-2 h-4 w-4" />
              Nhận diện ảnh
            </Button>
            <Link href="/import/history">
              <Button variant="outline" className="rounded-xl">
                <History className="mr-2 h-4 w-4" />
                Lịch sử
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supplier */}
            <div className="bg-card rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-medium">Thông tin phiếu nhập</h2>
              <div className="max-w-sm">
                <Label>Nhà cung cấp</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger className="rounded-xl mt-2">
                    <SelectValue placeholder="Chọn nhà cung cấp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có</SelectItem>
                    {suppliers.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            <div className="bg-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Danh sách sản phẩm</h2>
                <Button onClick={addRow} className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm hàng
                </Button>
              </div>

              {/* Table Header */}
              <div className="flex gap-4 px-4 py-2 bg-muted rounded-xl text-sm font-medium text-muted-foreground">
                <div className="flex-1">Tên sản phẩm</div>
                <div className="w-20 text-center">SL</div>
                <div className="w-32 text-right">Đơn giá</div>
                <div className="w-28 text-right">Thành tiền</div>
                <div className="w-10"></div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-4 items-center p-3 bg-muted/50 rounded-xl">
                    <div className="flex-1">
                      <Input
                        value={item.productName}
                        onChange={(e) => updateItemName(item.id, e.target.value)}
                        placeholder={`Tên sản phẩm ${index + 1}`}
                        className="rounded-xl"
                      />
                      {item.productId ? (
                        <p className="text-xs text-green-600 mt-1">Đã khớp với sản phẩm</p>
                      ) : item.productName ? (
                        <p className="text-xs text-amber-600 mt-1">Sản phẩm mới</p>
                      ) : null}
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="rounded-xl text-center"
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                        className="rounded-xl text-right"
                        placeholder="0"
                      />
                    </div>
                    <div className="w-28 text-right font-medium">
                      {(item.quantity * item.unitPrice).toLocaleString()} đ
                    </div>
                    <div className="w-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-destructive"
                        onClick={() => removeRow(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card rounded-2xl p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-medium">Tổng quan</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số hàng</span>
                  <span>{items.filter(i => i.productName).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng số lượng</span>
                  <span>{items.filter(i => i.productName).reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-medium">Tổng tiền</span>
                  <span className="text-xl font-bold text-primary">{getTotal().toLocaleString()} đ</span>
                </div>
              </div>
              <Button
                className="w-full rounded-xl"
                size="lg"
                disabled={items.filter(i => i.productName).length === 0 || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu phiếu nhập
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Dialog */}
      <Dialog open={showSimilarDialog} onOpenChange={setShowSimilarDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Sản phẩm tương tự
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Sản phẩm "{tempProductName}" chưa có. Chọn sản phẩm tương tự hoặc tạo mới.
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {similarProducts.map(product => (
              <button
                key={product.id}
                onClick={() => selectSimilarProduct(product)}
                className="w-full flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-xl text-left"
              >
                <Package className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                </div>
                <span className="font-medium">{parseFloat(product.importPrice).toLocaleString()} đ</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowSimilarDialog(false)}
            >
              Tạo sản phẩm mới
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-xl"
              onClick={() => setShowSimilarDialog(false)}
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
