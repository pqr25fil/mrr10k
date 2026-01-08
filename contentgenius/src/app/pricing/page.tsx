"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | undefined) => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }

    if (!priceId) return;

    setIsLoading(priceId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      key: "free" as const,
      icon: Sparkles,
      popular: false,
    },
    {
      key: "pro" as const,
      icon: Zap,
      popular: true,
    },
    {
      key: "business" as const,
      icon: Building2,
      popular: false,
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Простые и понятные тарифы
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Выберите план, который подходит именно вам. Начните бесплатно и
            переходите на платный тариф, когда будете готовы.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map(({ key, icon: Icon, popular }) => {
            const plan = PLANS[key];
            const isPro = key === "pro";
            const isBusiness = key === "business";

            return (
              <Card
                key={key}
                className={`relative ${
                  popular
                    ? "border-2 border-violet-500 shadow-xl shadow-violet-500/10"
                    : ""
                }`}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Популярный
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${
                      popular
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                        : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="mt-4 text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="text-center mb-8">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500">/месяц</span>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={popular ? "default" : "outline"}
                    size="lg"
                    onClick={() =>
                      isPro
                        ? handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID)
                        : isBusiness
                        ? handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID)
                        : router.push(session ? "/dashboard" : "/auth/signup")
                    }
                    isLoading={
                      isLoading === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ||
                      isLoading === process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID
                    }
                    disabled={key === "free" && !!session}
                  >
                    {key === "free"
                      ? session
                        ? "Текущий план"
                        : "Начать бесплатно"
                      : "Выбрать план"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Часто задаваемые вопросы
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Могу ли я отменить подписку в любое время?",
                a: "Да, вы можете отменить подписку в любой момент. Доступ к платным функциям сохранится до конца оплаченного периода.",
              },
              {
                q: "Какие способы оплаты вы принимаете?",
                a: "Мы принимаем все основные кредитные и дебетовые карты через Stripe: Visa, Mastercard, American Express и другие.",
              },
              {
                q: "Могу ли я перейти на другой тариф?",
                a: "Конечно! Вы можете в любой момент перейти на более высокий или низкий тариф. Изменения вступят в силу немедленно.",
              },
              {
                q: "Что произойдет, если я превышу лимит генераций?",
                a: "Если вы достигнете дневного лимита, вы не сможете создавать новый контент до следующего дня или можете перейти на более высокий тариф.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg shadow-gray-100/50"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
