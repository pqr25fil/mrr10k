"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  Mail,
  ShoppingBag,
  Target,
  TrendingUp,
  Copy,
  Check,
  Sparkles,
  Zap,
  RotateCcw,
  Crown,
  Download,
} from "lucide-react";
import Link from "next/link";

const contentTypes = [
  { id: "blog", name: "Статья для блога", icon: FileText, color: "bg-blue-500" },
  { id: "social", name: "Пост для соцсетей", icon: MessageSquare, color: "bg-pink-500" },
  { id: "email", name: "Email-рассылка", icon: Mail, color: "bg-green-500" },
  { id: "product", name: "Описание товара", icon: ShoppingBag, color: "bg-orange-500" },
  { id: "ad", name: "Рекламный текст", icon: Target, color: "bg-red-500" },
  { id: "seo", name: "SEO-контент", icon: TrendingUp, color: "bg-purple-500" },
];

interface UsageData {
  plan: string;
  usage: {
    used: number;
    limit: number;
    remaining: number;
    total: number;
  };
  subscription: {
    active: boolean;
    currentPeriodEnd: string | null;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedType, setSelectedType] = useState("blog");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("ru");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageData | null>(null);

  const toneOptions = [
    { value: "professional", label: "Профессиональный" },
    { value: "casual", label: "Неформальный" },
    { value: "friendly", label: "Дружелюбный" },
    { value: "formal", label: "Официальный" },
    { value: "creative", label: "Креативный" },
    { value: "persuasive", label: "Убедительный" },
  ];

  const languageOptions = [
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUsage();
    }
  }, [session]);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/user/usage");
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error("Error fetching usage:", error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Введите описание контента");
      return;
    }

    setError("");
    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          prompt,
          tone,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(`Лимит исчерпан. Использовано ${data.used}/${data.limit} генераций сегодня.`);
        } else {
          setError(data.error || "Ошибка при генерации");
        }
        return;
      }

      setGeneratedContent(data.content.content);
      fetchUsage();
    } catch {
      setError("Произошла ошибка при генерации контента");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: "txt" | "md" | "html") => {
    let content = generatedContent;
    let filename = `content-${Date.now()}`;
    let mimeType = "text/plain";

    switch (format) {
      case "md":
        filename += ".md";
        mimeType = "text/markdown";
        break;
      case "html":
        content = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сгенерированный контент</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
  </style>
</head>
<body>
${generatedContent.replace(/\n/g, "<br>")}
</body>
</html>`;
        filename += ".html";
        mimeType = "text/html";
        break;
      default:
        filename += ".txt";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const usagePercentage = usage
    ? Math.min((usage.usage.used / usage.usage.limit) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Привет, {session.user?.name || "пользователь"}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Создавайте контент с помощью AI
          </p>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-600" />
                  <span className="font-medium text-gray-700">
                    Генерации сегодня
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {usage?.usage.used || 0}/{usage?.usage.limit === Infinity ? "∞" : usage?.usage.limit || 5}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-gray-700">Ваш план</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {usage?.plan || "Free"}
              </p>
              {usage?.plan === "free" && (
                <Link href="/pricing">
                  <Button variant="link" className="p-0 h-auto text-violet-600">
                    Улучшить план →
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <span className="font-medium text-gray-700">
                  Всего генераций
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {usage?.usage.total || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Тип контента</CardTitle>
                <CardDescription>
                  Выберите, какой контент вы хотите создать
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        selectedType === type.id
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 hover:border-violet-200 hover:bg-violet-50/50"
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-lg ${type.color} flex items-center justify-center`}
                      >
                        <type.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 text-center">
                        {type.name}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Описание</CardTitle>
                <CardDescription>
                  Опишите, о чём должен быть контент
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={
                    selectedType === "blog"
                      ? "Напиши статью о преимуществах удалённой работы..."
                      : selectedType === "social"
                      ? "Создай пост про запуск нового продукта..."
                      : selectedType === "email"
                      ? "Напиши письмо о скидках для постоянных клиентов..."
                      : selectedType === "product"
                      ? "Опиши беспроводные наушники с шумоподавлением..."
                      : selectedType === "ad"
                      ? "Создай рекламу курсов программирования..."
                      : "Напиши SEO-текст про услуги веб-разработки..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px]"
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Тон
                    </label>
                    <Select
                      options={toneOptions}
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Язык
                    </label>
                    <Select
                      options={languageOptions}
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  disabled={!prompt.trim() || isGenerating}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Сгенерировать контент
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Результат</CardTitle>
                  <CardDescription>
                    Сгенерированный AI контент
                  </CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      title="Копировать"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      title="Сгенерировать заново"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <div className="relative group">
                      <Button
                        variant="outline"
                        size="sm"
                        title="Экспорт"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
                        <button
                          onClick={() => handleExport("txt")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-violet-50 text-gray-700"
                        >
                          Скачать .txt
                        </button>
                        <button
                          onClick={() => handleExport("md")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-violet-50 text-gray-700"
                        >
                          Скачать .md
                        </button>
                        <button
                          onClick={() => handleExport("html")}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-violet-50 text-gray-700"
                        >
                          Скачать .html
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4" />
                  <p className="text-gray-500">Генерируем контент...</p>
                </div>
              ) : generatedContent ? (
                <div className="prose prose-violet max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 rounded-xl p-6 min-h-[300px]">
                    {generatedContent}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Готовы к генерации?
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Выберите тип контента, опишите задачу и нажмите кнопку
                    генерации
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
