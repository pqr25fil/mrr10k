# 🚀 Руководство по деплою ContentGenius

## Быстрый деплой на Vercel

### 1. Подготовка

```bash
# Убедитесь, что проект работает локально
npm run build
npm run dev
```

### 2. Настройка базы данных (PostgreSQL)

Для продакшена рекомендуем использовать [Neon](https://neon.tech) или [Supabase](https://supabase.com):

1. Создайте аккаунт на Neon.tech
2. Создайте новый проект и базу данных
3. Скопируйте connection string

Обновите `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Настройка Stripe

1. Зарегистрируйтесь на [stripe.com](https://stripe.com)
2. Включите **Live mode** в настройках
3. Создайте продукты:

**Pro Plan ($19/месяц):**
- Name: "Pro"
- Price: $19.00 USD / month
- Скопируйте Price ID

**Business Plan ($49/месяц):**
- Name: "Business"  
- Price: $49.00 USD / month
- Скопируйте Price ID

4. Настройте Webhook:
- URL: `https://your-domain.com/api/stripe/webhook`
- События:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `customer.subscription.deleted`

### 4. Деплой на Vercel

```bash
# Установите Vercel CLI
npm i -g vercel

# Авторизуйтесь
vercel login

# Деплой
vercel
```

### 5. Переменные окружения в Vercel

В настройках проекта добавьте:

| Переменная | Значение |
|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-domain.com` |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRO_PRICE_ID` | `price_...` |
| `STRIPE_BUSINESS_PRICE_ID` | `price_...` |
| `OPENAI_API_KEY` | `sk-...` |

### 6. Миграция базы данных

```bash
npx prisma db push
```

### 7. Настройка домена

1. В Vercel: Settings → Domains
2. Добавьте ваш домен
3. Обновите DNS записи

## 🔧 Дополнительные настройки

### Google OAuth (опционально)

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com)
2. Включите Google+ API
3. Создайте OAuth credentials
4. Добавьте в Vercel:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Мониторинг

Рекомендуем подключить:
- [Sentry](https://sentry.io) для отслеживания ошибок
- [Vercel Analytics](https://vercel.com/analytics) для аналитики
- [Stripe Dashboard](https://dashboard.stripe.com) для платежей

## 📊 Метрики для отслеживания

- **MRR** (Monthly Recurring Revenue)
- **Churn Rate** (отток клиентов)
- **CAC** (Customer Acquisition Cost)
- **LTV** (Lifetime Value)
- **Conversion Rate** (Free → Paid)

## 🎯 Цель: $10k MRR

Чтобы достичь $10,000/месяц:

| Сценарий | Pro ($19) | Business ($49) | Итого |
|----------|-----------|----------------|-------|
| 1 | 527 | 0 | $10,013 |
| 2 | 0 | 205 | $10,045 |
| 3 | 300 | 60 | $10,640 |
| 4 | 200 | 100 | $8,700 |

Рекомендуемая стратегия: 300 Pro + 60 Business

## 💡 Советы по маркетингу

1. **Контент-маркетинг** — используйте свой продукт для создания контента
2. **SEO** — оптимизируйте landing page
3. **Product Hunt** — запустите продукт там
4. **Партнёрская программа** — 20% комиссии партнёрам
5. **Freemium** — 5 бесплатных генераций привлекают пользователей

## 🆘 Поддержка

- Email: support@contentgenius.ai
- Документация: /docs
- Discord: /discord

---

Удачного запуска! 🚀
