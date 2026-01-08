import Link from "next/link";

import { getSession } from "@/lib/session";
import { UpgradeButton } from "@/components/UpgradeButton";

export default async function PricingPage() {
  const session = await getSession();
  const loggedIn = Boolean(session?.user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Тарифы</h1>
      <p className="max-w-2xl text-zinc-700">
        FREE подходит для старта. PRO — когда нужна монетизация/экспорт и
        расширенные возможности.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="text-sm font-medium text-zinc-700">FREE</div>
          <div className="mt-2 text-3xl font-semibold">$0</div>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            <li>1 проект</li>
            <li>Сбор email</li>
            <li>Базовая аналитика</li>
          </ul>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Открыть
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="text-sm font-medium text-zinc-700">PRO</div>
          <div className="mt-2 text-3xl font-semibold">$29 / мес</div>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            <li>До 10 проектов</li>
            <li>Экспорт CSV</li>
            <li>Приоритетные фичи</li>
          </ul>
          <div className="mt-6">
            {loggedIn ? (
              <UpgradeButton />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Войти и оформить
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

