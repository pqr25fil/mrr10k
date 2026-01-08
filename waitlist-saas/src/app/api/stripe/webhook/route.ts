import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function planFromSubscriptionStatus(status: string) {
  // https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses
  if (status === "active" || status === "trialing") return "PRO" as const;
  return "FREE" as const;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "MISSING_WEBHOOK_SECRET" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer?.toString();
      const subscriptionId = session.subscription?.toString();
      const userId = session.metadata?.userId ?? null;
      if (customerId && userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId ?? null,
            plan: "PRO",
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer.toString();
      const plan = planFromSubscriptionStatus(sub.status);
      const priceId =
        sub.items.data[0]?.price?.id ??
        null;
      // Stripe typings in some versions omit current_period_end.
      // Read it defensively to avoid breaking builds.
      const periodEndSec = (sub as unknown as { current_period_end?: number })
        .current_period_end;
      const periodEnd = periodEndSec
        ? new Date(periodEndSec * 1000)
        : null;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: periodEnd,
          plan,
        },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

