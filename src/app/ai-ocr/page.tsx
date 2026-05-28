"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Check,
  Loader2,
  Key,
  FlaskConical,
  Upload,
} from "lucide-react";

export default function AIOCRPage() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isProcessing, setIsProcessing] = useState(false);
  const [testImage, setTestImage] = useState<string | null>(null);

  const aiModels = [
    { 
      id: "gpt-4o", 
      name: "GPT-4o", 
      provider: "OpenAI",
      description: "Mô hình mạnh nhất, hỗ trợ vision",
      status: "active"
    },
    { 
      id: "claude", 
      name: "Claude 3", 
      provider: "Anthropic",
      description: "Xuất sắc trong phân tích hình ảnh",
      status: "available"
    },
    { 
      id: "gemini", 
      name: "Gemini Pro", 
      provider: "Google",
      description: "Miễn phí với API key",
      status: "available"
    },
  ];

  const handleTest = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AI OCR</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và thử nghiệm các mô hình AI nhận diện hóa đơn
          </p>
        </div>

        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="rounded-xl">
            <TabsTrigger value="models" className="rounded-lg">
              <Bot className="mr-2 h-4 w-4" />
              Mô hình AI
            </TabsTrigger>
            <TabsTrigger value="test" className="rounded-lg">
              <FlaskConical className="mr-2 h-4 w-4" />
              Thử nghiệm
            </TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {aiModels.map((model) => (
                <div
                  key={model.id}
                  className={`bg-card rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedModel === model.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      model.id === "gpt-4o" ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600" :
                      model.id === "claude" ? "bg-orange-100 dark:bg-orange-950/50 text-orange-600" :
                      "bg-blue-100 dark:bg-blue-950/50 text-blue-600"
                    }`}>
                      <Bot className="h-5 w-5" />
                    </div>
                    {selectedModel === model.id && (
                      <Badge variant="success">
                        <Check className="h-3 w-3 mr-1" />
                        Đang dùng
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium">{model.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {model.provider}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {model.description}
                  </p>
                </div>
              ))}
            </div>

            {/* API Configuration */}
            <div className="bg-card rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Key className="h-5 w-5" />
                Cấu hình API
              </h2>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type="password"
                    placeholder="Nhập API key của bạn"
                    className="rounded-xl"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  API key sẽ được mã hóa và lưu trữ an toàn trên máy chủ.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upload */}
              <div className="bg-card rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-medium">Tải ảnh lên</h2>
                <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 transition-colors">
                  {testImage ? (
                    <div className="space-y-4">
                      <img
                        src={testImage}
                        alt="Test"
                        className="max-h-48 mx-auto rounded-xl shadow-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTestImage(null)}
                        className="rounded-xl"
                      >
                        Xóa ảnh
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Kéo và thả ảnh hóa đơn vào đây
                      </p>
                      <label>
                        <Input type="file" accept="image/*" className="hidden" />
                        <Button variant="outline" className="rounded-xl cursor-pointer" asChild>
                          <span>Chọn ảnh</span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>
                {testImage && (
                  <Button
                    className="w-full rounded-xl"
                    onClick={handleTest}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Nhận diện
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Result */}
              <div className="bg-card rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-medium">Kết quả</h2>
                <div className="text-center py-16 text-muted-foreground">
                  <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có kết quả</p>
                  <p className="text-sm">
                    Tải ảnh lên để thử nghiệm
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
