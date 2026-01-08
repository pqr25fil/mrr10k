import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

function toCsvRow(fields: string[]) {
  return (
    fields
      .map((v) => {
        const s = String(v ?? "");
        const escaped = s.replaceAll('"', '""');
        return `"${escaped}"`;
      })
      .join(",") + "\n"
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (user.plan !== "PRO") {
    return NextResponse.json({ error: "PRO_REQUIRED" }, { status: 402 });
  }

  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: { id, ownerId: user.id },
  });
  if (!project) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const signups = await prisma.waitlistSignup.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });

  let csv = "";
  csv += toCsvRow(["createdAt", "email", "ip", "userAgent"]);
  for (const s of signups) {
    csv += toCsvRow([
      s.createdAt.toISOString(),
      s.email,
      s.ip ?? "",
      s.userAgent ?? "",
    ]);
  }

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${project.slug}-waitlist.csv"`,
    },
  });
}

