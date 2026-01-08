import type { Plan } from "@/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: Plan;
      stripeCustomerId?: string | null;
    } & DefaultSession["user"];
  }
}

