import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { getStripe, requireStripeEnv } from "@/lib/stripe";

export async function POST(req: Request) {
  requireStripeEnv();
  const stripe = getStripe();
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const origin = new URL(req.url).origin;

  let stripeCustomerId = dbUser.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      metadata: { userId: dbUser.id },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { stripeCustomerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancel`,
    metadata: { userId: dbUser.id },
  });

  return NextResponse.json({ url: session.url });
}

