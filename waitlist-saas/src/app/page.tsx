import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Запусти свою waitlist-страницу за 5 минут
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-700">
          Создавай публичные страницы ожидания, собирай emails, смотри конверсию.
          PRO открывает экспорт, кастомизацию и дополнительные фичи.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Открыть дашборд
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Посмотреть тарифы
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Публичная ссылка", d: "У каждого проекта свой URL: /w/slug" },
          { t: "Аналитика", d: "Сколько подписались, когда, откуда" },
          { t: "Монетизация", d: "Stripe подписка PRO + вебхуки" },
        ].map((x) => (
          <div
            key={x.t}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <div className="font-medium">{x.t}</div>
            <div className="mt-2 text-sm text-zinc-700">{x.d}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
