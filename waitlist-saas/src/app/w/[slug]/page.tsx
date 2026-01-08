import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { SignupForm } from "@/components/SignupForm";

export default async function WaitlistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { slug, isPublished: true },
  });
  if (!project) return notFound();

  const total = await prisma.waitlistSignup.count({
    where: { projectId: project.id },
  });

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8">
        <div className="text-sm font-medium text-zinc-700">WAITLIST</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {project.name}
        </h1>
        {project.description ? (
          <p className="mt-3 text-zinc-700">{project.description}</p>
        ) : (
          <p className="mt-3 text-zinc-700">
            Подпишись, чтобы получить доступ одним из первых.
          </p>
        )}

        <div className="mt-6">
          <SignupForm slug={project.slug} />
        </div>

        <div className="mt-4 text-xs text-zinc-600">
          Уже в списке: <span className="font-medium">{total}</span>
        </div>
      </div>

      <div className="text-center text-xs text-zinc-600">
        Сделано на <span className="font-medium">Waitlist Builder</span>
      </div>
    </div>
  );
}

