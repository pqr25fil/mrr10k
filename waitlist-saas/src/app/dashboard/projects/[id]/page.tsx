import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export default async function ProjectAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, ownerId: user.id },
  });
  if (!project) return notFound();

  const total = await prisma.waitlistSignup.count({ where: { projectId: id } });
  const recent = await prisma.waitlistSignup.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <div className="mt-2 text-sm text-zinc-700">
            Публичная страница:{" "}
            <Link className="font-mono text-zinc-950" href={`/w/${project.slug}`}>
              /w/{project.slug}
            </Link>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50"
        >
          Назад
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="text-sm text-zinc-700">Всего подписок</div>
          <div className="mt-2 text-3xl font-semibold">{total}</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:col-span-2">
          <div className="text-sm text-zinc-700">Экспорт</div>
          <div className="mt-2 text-sm">
            <Link className="font-medium text-zinc-950 hover:underline" href={`/api/projects/${project.id}/export`}>
              Скачать CSV
            </Link>
            <div className="mt-2 text-xs text-zinc-600">
              Доступно только на PRO (FREE получит ошибку).
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Последние подписки</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-700">
                <th className="py-2 pr-4">Дата</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">IP</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="border-t border-zinc-100">
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {s.createdAt.toISOString().slice(0, 19).replace("T", " ")}
                  </td>
                  <td className="py-2 pr-4">{s.email}</td>
                  <td className="py-2 pr-4">{s.ip ?? "-"}</td>
                </tr>
              ))}
              {recent.length === 0 ? (
                <tr>
                  <td className="py-4 text-zinc-700" colSpan={3}>
                    Пока нет подписок.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

