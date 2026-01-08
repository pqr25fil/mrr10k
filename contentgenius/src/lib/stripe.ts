import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    description: "Для начала работы",
    price: 0,
    generationsPerDay: 5,
    features: [
      "5 генераций в день",
      "Базовые шаблоны",
      "Email поддержка",
    ],
  },
  pro: {
    name: "Pro",
    description: "Для профессионалов",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    generationsPerDay: 100,
    features: [
      "100 генераций в день",
      "Все шаблоны",
      "Приоритетная поддержка",
      "История генераций",
      "Экспорт в разные форматы",
    ],
  },
  business: {
    name: "Business",
    description: "Для команд и бизнеса",
    price: 49,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    generationsPerDay: Infinity,
    features: [
      "Безлимитные генерации",
      "Все шаблоны",
      "Приоритетная поддержка 24/7",
      "API доступ",
      "Командный доступ",
      "Персональный менеджер",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanFromPriceId(priceId: string | null): PlanType {
  if (!priceId) return "free";
  if (priceId === PLANS.pro.priceId) return "pro";
  if (priceId === PLANS.business.priceId) return "business";
  return "free";
}

export function getGenerationsLimit(priceId: string | null): number {
  const plan = getPlanFromPriceId(priceId);
  return PLANS[plan].generationsPerDay;
}
