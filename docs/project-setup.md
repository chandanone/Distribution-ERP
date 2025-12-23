# STEP 1 — Create Next.js Project (App Router)
```
npx create-next-app@latest pump-erp
cd pump-erp

```
# STEP 2 — Install Core Dependencies

```
npm install prisma @prisma/client
npm install next-auth bcrypt
npm install zod


```

# STEP 3 — Setup Prisma with PostgreSQL

```
npx prisma init


```
# Update .env:
```
DATABASE_URL="postgresql://user:password@localhost:5432/erp_db"

```

# prisma steps - prisma -7.2.0


# Install Prisma CLI
npm install prisma --save-dev

# Install Prisma Client
npm install @prisma/client

For Prisma in Next.js, it is highly recommended to use the Pooled connection

```
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```
======
Sync Schema with Neon (The "Pull" Step)

Since you already have 15 tables, do not write the models manually. Run the pull command to populate your schema.prisma
```
npx prisma db pull
```

Prisma 7 will detect the variable and connect to Neon automatically.
auto create schema for tables in neon db

```
npx prisma generate
```

Setup the Prisma Singleton (lib/db.ts)

In Next.js, the "Hot Reload" feature can create hundreds of database connections, crashing your Neon free tier.
 Use this singleton pattern to keep it to one connection.

lib/db.ts
```
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```
=======
add neon adapter

Prisma no longer bundles the heavy Rust binary. Instead, it requires you to provide a Driver Adapter 
(like the Neon serverless driver) to handle the actual database connection.
```
npm install @prisma/adapter-neon @neondatabase/serverless

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
```
