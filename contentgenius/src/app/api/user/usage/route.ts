import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGenerationsLimit, getPlanFromPriceId } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        generationsToday: true,
        lastGenerationDate: true,
        totalGenerations: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if we need to reset daily counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastGenDate = user.lastGenerationDate
      ? new Date(user.lastGenerationDate)
      : null;

    let generationsToday = user.generationsToday;
    if (!lastGenDate || lastGenDate < today) {
      generationsToday = 0;
    }

    const limit = getGenerationsLimit(user.stripePriceId);
    const plan = getPlanFromPriceId(user.stripePriceId);

    return NextResponse.json({
      plan,
      usage: {
        used: generationsToday,
        limit,
        remaining: Math.max(0, limit - generationsToday),
        total: user.totalGenerations,
      },
      subscription: {
        active: !!user.stripePriceId,
        currentPeriodEnd: user.stripeCurrentPeriodEnd,
      },
    });
  } catch (error) {
    console.error("Usage error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных" },
      { status: 500 }
    );
  }
}
