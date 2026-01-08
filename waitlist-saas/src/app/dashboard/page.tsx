import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { createProjectAction } from "@/app/dashboard/actions";
import { BillingButtons } from "@/components/BillingButtons";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string; checkout?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const projects = await prisma.project.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { signups: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Дашборд</h1>
          <p className="mt-2 text-sm text-zinc-700">
            План:{" "}
            <span className="font-medium text-zinc-950">
              {user.plan === "PRO" ? "PRO" : "FREE"}
            </span>
          </p>
        </div>
        <BillingButtons plan={user.plan} />
      </div>

      {sp.checkout === "success" ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Оплата прошла. План обновится после обработки webhook (обычно мгновенно).
        </div>
      ) : null}
      {sp.created ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Проект создан.
        </div>
      ) : null}
      {sp.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {sp.error === "limit"
            ? "Лимит проектов на текущем плане."
            : sp.error === "slug_taken"
              ? "Этот slug уже занят."
              : "Ошибка. Проверь поля и попробуй снова."}
        </div>
      ) : null}

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="text-lg font-semibold">Создать проект</div>
        <p className="mt-2 text-sm text-zinc-700">
          У проекта будет публичная страница: <span className="font-mono">/w/slug</span>
        </p>

        <form action={createProjectAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            name="name"
            placeholder="Название (например, My App)"
            className="rounded-md border border-zinc-200 px-3 py-2"
            required
            maxLength={60}
          />
          <input
            name="slug"
            placeholder="slug (например, my-app)"
            className="rounded-md border border-zinc-200 px-3 py-2 font-mono"
            required
            maxLength={40}
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Создать
          </button>
        </form>
        <p className="mt-3 text-xs text-zinc-600">
          FREE: 1 проект. PRO: до 10 проектов.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Проекты</h2>
          <Link href="/pricing" className="text-sm font-medium text-zinc-950">
            Апгрейд
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
            Пока нет проектов — создай первый выше.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="mt-1 text-sm text-zinc-700">
                      Slug: <span className="font-mono">{p.slug}</span>
                    </div>
                    <div className="mt-1 text-sm text-zinc-700">
                      Подписок: <span className="font-medium">{p._count.signups}</span>
                    </div>
                  </div>
                  <Link
                    href={`/w/${p.slug}`}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
                  >
                    Открыть
                  </Link>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/dashboard/projects/${p.id}`}
                    className="text-sm font-medium text-zinc-950 hover:underline"
                  >
                    Аналитика
                  </Link>
                  <Link
                    href={`/api/projects/${p.id}/export`}
                    className="text-sm font-medium text-zinc-950 hover:underline"
                  >
                    Экспорт CSV
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

