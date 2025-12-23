import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

// 1. Get your connection string
const connectionString = process.env.DATABASE_URL!;

// 2. Pass the config object directly (DO NOT create a new Pool)
const adapter = new PrismaNeon({ connectionString });

// 3. Initialize the Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
