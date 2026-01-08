import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook signature verification failed:", errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed": {
      const subscriptionData = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = subscriptionData as any;

      await prisma.user.update({
        where: {
          id: session.metadata?.userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: typeof subscription.customer === 'string' 
            ? subscription.customer 
            : subscription.customer?.id,
          stripePriceId: subscription.items?.data?.[0]?.price?.id,
          stripeCurrentPeriodEnd: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000)
            : subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd * 1000)
            : null,
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const subscriptionData = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = subscriptionData as any;

      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items?.data?.[0]?.price?.id,
          stripeCurrentPeriodEnd: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000)
            : subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd * 1000)
            : null,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;

      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
