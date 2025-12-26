Auth.js (NextAuth) tutorial tailored to your setup
(Next.js App Router + Prisma + Google + Email/Password + ERP users table).

No theory overload. Just what, why, where.

Auth.js (NextAuth) — Short Tutorial
1️⃣ What Auth.js does

Auth.js handles:

Login (Google / Email)

Sessions (JWT or DB)

Secure cookies

User persistence via Prisma

You don’t write OAuth logic — Auth.js does it.

2️⃣ Core files you need (App Router)
app/api/auth/[...nextauth]/route.ts ← auth API
lib/auth.ts ← config
lib/db.ts ← Prisma client
types/next-auth.d.ts ← TS augmentation

3️⃣ Database requirement (Prisma)

Auth.js requires these models:

model Account {
id Int @id @default(autoincrement())
userId Int
type String
provider String
providerAccountId String
access_token String?
refresh_token String?
expires_at Int?
token_type String?
scope String?
id_token String?
session_state String?

users users @relation(fields: [userId], references: [id])

@@unique([provider, providerAccountId])
}

model Session {
id Int @id @default(autoincrement())
sessionToken String @unique
userId Int
expires DateTime

users users @relation(fields: [userId], references: [id])
}

(Auth.js adapter uses these automatically)

4️⃣ Auth config (lib/auth.ts)
Minimal working config
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

export const authConfig = {
adapter: PrismaAdapter(prisma),

session: { strategy: "jwt" },

providers: [
Google({
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),

    Credentials({
      async authorize(credentials) {
        // your DB check
        return user || null;
      },
    }),

],
};

export const { handlers, auth } = NextAuth(authConfig);

5️⃣ Route handler (ONLY ONE FILE)

📁 app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

👉 This single file handles:

/api/auth/signin

/api/auth/callback/google

/api/auth/session

/api/auth/signout

6️⃣ How login works (flow)
Google Login

User clicks “Sign in with Google”

Redirect → Google

Google → /api/auth/callback/google

Auth.js:

Creates user (if new)

Creates account link

Creates session

Email/Password Login

authorize() runs

You verify password

Return user object

Auth.js creates JWT/session

7️⃣ Sessions & JWT
JWT callback

Runs when token is created/updated

callbacks: {
async jwt({ token, user }) {
if (user) token.role_id = user.role_id;
return token;
},
}

Session callback

Runs before sending data to client

async session({ session, token }) {
session.user.role_id = token.role_id;
return session;
}

8️⃣ Access auth data
Server Components
import { auth } from "@/lib/auth";

const session = await auth();

Client Components
import { useSession } from "next-auth/react";

const { data: session } = useSession();

9️⃣ Protect routes (quick)
const session = await auth();
if (!session) redirect("/login");

🔟 Environment variables
NEXTAUTH_SECRET=long-random-string
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=yyyy
NEXTAUTH_URL=http://localhost:3000

11️⃣ Common mistakes ❌
Mistake Fix
Creating /callback/google manually ❌ Don’t
Using AuthOptions ❌ Use NextAuthConfig
Missing NEXTAUTH_SECRET ❌ App crashes
No module augmentation ❌ TS errors
12️⃣ Mental model (remember this)

Auth.js = middleware between UI and DB

You provide:

DB

Providers

Callbacks

Auth.js provides:

Security

OAuth

Sessions
