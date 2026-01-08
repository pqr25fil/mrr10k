"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Crown,
  CreditCard,
  Calendar,
  Zap,
  Shield,
  LogOut,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { PLANS } from "@/lib/stripe";

interface UsageData {
  plan: keyof typeof PLANS;
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile");
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

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
    } finally {
      setIsLoading(false);
    }
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

  const currentPlan = usage?.plan ? PLANS[usage.plan] : PLANS.free;
  const periodEnd = usage?.subscription.currentPeriodEnd
    ? new Date(usage.subscription.currentPeriodEnd)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
          <p className="mt-2 text-gray-600">
            Управляйте своим аккаунтом и подпиской
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* User Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-600" />
                  Личные данные
                </CardTitle>
                <CardDescription>
                  Информация о вашем аккаунте
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Имя
                  </label>
                  <Input
                    value={session.user?.name || ""}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={session.user?.email || ""}
                      disabled
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-violet-600" />
                  Подписка
                </CardTitle>
                <CardDescription>
                  Управление вашим тарифным планом
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        План {currentPlan.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {currentPlan.price === 0
                          ? "Бесплатно"
                          : `$${currentPlan.price}/месяц`}
                      </p>
                    </div>
                  </div>
                  {usage?.plan !== "free" && periodEnd && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Следующий платёж</p>
                      <p className="font-medium text-gray-900">
                        {periodEnd.toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {usage?.plan === "free" ? (
                    <Link href="/pricing" className="flex-1">
                      <Button className="w-full">
                        Улучшить план
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleManageSubscription}
                      isLoading={isLoading}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Управление подпиской
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-600" />
                  Безопасность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-violet-600" />
                    <span className="text-gray-600">Сегодня</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {usage?.usage.used || 0}/{usage?.usage.limit === Infinity ? "∞" : usage?.usage.limit || 5}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                    style={{
                      width: `${Math.min(
                        ((usage?.usage.used || 0) / (usage?.usage.limit || 5)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-violet-600" />
                      <span className="text-gray-600">Всего генераций</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {usage?.usage.total || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-violet-600" />
                    <span className="text-gray-600">Аккаунт создан</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Нужна помощь?</h3>
                <p className="text-violet-100 text-sm mb-4">
                  Напишите нам, и мы ответим в течение 24 часов
                </p>
                <a href="mailto:support@contentgenius.ai">
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-violet-600 hover:bg-violet-50"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Написать в поддержку
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
