import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getSqliteFilePath() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  if (!url.startsWith("file:")) return url;
  const filePath = url.replace(/^file:/, "");
  // Resolve relative to project root (process.cwd()).
  return path.resolve(process.cwd(), filePath);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: getSqliteFilePath() }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

