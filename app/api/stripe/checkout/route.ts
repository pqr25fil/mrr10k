import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const settingsUrl = process.env.NEXTAUTH_URL + "/dashboard/settings";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Find user to check if they already have a stripe customer id
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id as string },
  });

  if (!dbUser) {
    return new NextResponse("User not found", { status: 404 });
  }

  // 1. If user has a subscription, redirect to Customer Portal
  if (dbUser.stripeCustomerId && dbUser.stripeSubscriptionId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: settingsUrl,
    });

    return NextResponse.json({ url: stripeSession.url });
  }

  // 2. Otherwise, create a Checkout Session
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: settingsUrl,
    cancel_url: settingsUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: session.user.email || undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "ContentFlow Pro",
            description: "Unlimited AI generations",
          },
          unit_amount: 2900, // $29.00
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id as string,
    },
  });

  return NextResponse.json({ url: stripeSession.url });
}
