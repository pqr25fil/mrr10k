import type { Plan } from "@/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    plan: Plan;
    stripeCustomerId?: string | null;
  }

  interface Session {
    user: {
      id: string;
      plan: Plan;
      stripeCustomerId?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    plan: Plan;
    stripeCustomerId?: string | null;
  }
}

