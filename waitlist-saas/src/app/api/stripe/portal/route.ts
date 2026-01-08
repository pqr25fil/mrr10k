import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.stripeCustomerId) {
    return NextResponse.json({ error: "NO_CUSTOMER" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const portal = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${origin}/dashboard`,
  });
  return NextResponse.json({ url: portal.url });
}

