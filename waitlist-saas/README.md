# Waitlist Builder (Next.js + Auth + Stripe)

Минимальный микро‑SaaS: пользователь логинится, создаёт проект с публичной waitlist‑страницей, собирает emails, смотрит аналитику. Подписка **PRO** оформляется через **Stripe** и включается через webhook.

## Запуск локально

1) Установить зависимости:

```bash
cd waitlist-saas
npm i
```

2) Создать `.env`:

```bash
cp .env.example .env
openssl rand -base64 32
```

Вставь значение в `NEXTAUTH_SECRET`, и укажи Stripe ключи/price/webhook secret.

3) Миграции и запуск:

```bash
npx prisma migrate dev
npm run dev
```

## Stripe

- **Checkout**: `POST /api/stripe/checkout` (для залогиненного пользователя)
- **Billing Portal**: `POST /api/stripe/portal`
- **Webhook**: `POST /api/stripe/webhook`

Webhook обновляет `User.plan` в БД (FREE/PRO) по событиям подписки.

## Публичные страницы

- `/w/[slug]` — публичная waitlist-страница проекта
- `POST /api/waitlist/[slug]` — добавить email в лист

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
