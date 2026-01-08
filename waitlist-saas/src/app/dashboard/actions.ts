"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { slugify } from "@/lib/slug";

const createProjectSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().min(2).max(40).regex(/^[a-z0-9-]+$/),
});

export async function createProjectAction(formData: FormData) {
  const user = await requireUser();

  const rawName = String(formData.get("name") ?? "");
  const rawSlug = String(formData.get("slug") ?? "");
  const parsed = createProjectSchema.safeParse({
    name: rawName,
    slug: slugify(rawSlug),
  });
  if (!parsed.success) redirect("/dashboard?error=invalid_input");

  const projectCount = await prisma.project.count({ where: { ownerId: user.id } });
  const maxProjects = user.plan === "PRO" ? 10 : 1;
  if (projectCount >= maxProjects) redirect("/dashboard?error=limit");

  try {
    await prisma.project.create({
      data: {
        ownerId: user.id,
        name: parsed.data.name.trim(),
        slug: parsed.data.slug,
      },
    });
  } catch {
    redirect("/dashboard?error=slug_taken");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

