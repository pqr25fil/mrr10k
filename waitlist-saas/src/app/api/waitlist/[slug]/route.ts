import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email().max(200),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { slug, isPublished: true },
  });
  if (!project) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  try {
    await prisma.waitlistSignup.create({
      data: {
        projectId: project.id,
        email: parsed.data.email.toLowerCase(),
        ip,
        userAgent,
      },
    });
  } catch {
    return NextResponse.json({ error: "DUPLICATE" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}

