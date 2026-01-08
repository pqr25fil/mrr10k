"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  Mail,
  ShoppingBag,
  Target,
  TrendingUp,
  Copy,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

interface Content {
  id: string;
  type: string;
  prompt: string;
  content: string;
  createdAt: string;
}

interface HistoryResponse {
  contents: Content[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const typeIcons: Record<string, React.ElementType> = {
  blog: FileText,
  social: MessageSquare,
  email: Mail,
  product: ShoppingBag,
  ad: Target,
  seo: TrendingUp,
};

const typeNames: Record<string, string> = {
  blog: "Статья для блога",
  social: "Пост для соцсетей",
  email: "Email-рассылка",
  product: "Описание товара",
  ad: "Рекламный текст",
  seo: "SEO-контент",
};

const typeColors: Record<string, string> = {
  blog: "bg-blue-500",
  social: "bg-pink-500",
  email: "bg-green-500",
  product: "bg-orange-500",
  ad: "bg-red-500",
  seo: "bg-purple-500",
};

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [history, setHistory] = useState<Content[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/history");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchHistory();
    }
  }, [session, pagination.page, filterType]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: "10",
      });
      if (filterType) {
        params.append("type", filterType);
      }

      const response = await fetch(`/api/history?${params}`);
      const data: HistoryResponse = await response.json();

      setHistory(data.contents);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total,
      });
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот контент?")) return;

    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHistory(history.filter((item) => item.id !== id));
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (status === "loading" || (isLoading && history.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">История генераций</h1>
          <p className="mt-2 text-gray-600">
            Все ваши сгенерированные тексты ({pagination.total})
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filterType === null ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilterType(null);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            Все
          </Button>
          {Object.entries(typeNames).map(([key, name]) => (
            <Button
              key={key}
              variant={filterType === key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilterType(key);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              {name}
            </Button>
          ))}
        </div>

        {/* Content List */}
        {history.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                История пуста
              </h3>
              <p className="text-gray-500 mb-6">
                Создайте свой первый контент, и он появится здесь
              </p>
              <Button onClick={() => router.push("/dashboard")}>
                Создать контент
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const Icon = typeIcons[item.type] || FileText;
              const isExpanded = expandedId === item.id;

              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg ${
                            typeColors[item.type] || "bg-gray-500"
                          } flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {typeNames[item.type] || item.type}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(item.content, item.id)}
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Промпт:</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                        {item.prompt}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Результат:</p>
                      <div
                        className={`text-sm text-gray-700 bg-violet-50 rounded-lg p-3 ${
                          isExpanded ? "" : "line-clamp-4"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{item.content}</div>
                      </div>
                      {item.content.length > 300 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto mt-2"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.id)
                          }
                        >
                          {isExpanded ? "Свернуть" : "Показать полностью"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад
            </Button>
            <span className="text-sm text-gray-600">
              Страница {pagination.page} из {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              disabled={pagination.page === pagination.totalPages}
            >
              Вперёд
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
