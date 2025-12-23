lib/auth.ts – FULL EXPLANATION

```
1️⃣ Imports
import NextAuth, { type AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";

import { prisma } from "./db";
```

What each import does
Import Purpose
NextAuth Core Auth.js engine
AuthOptions Type safety for config
Google Google OAuth login
Credentials Email + Password login
PrismaAdapter Saves users, sessions, accounts in DB
bcrypt Compare hashed passwords
prisma DB access (users table)

2️⃣ Auth Configuration Object

```
export const authConfig: AuthOptions = {
```

This object defines how authentication works.

3️⃣ Prisma Adapter

```
adapter: PrismaAdapter(prisma),
```

What this does

Connects NextAuth ↔ PostgreSQL (Neon)

Automatically manages:

User

Account

Session

VerificationToken

💡 You do NOT manually insert OAuth users
PrismaAdapter does it for you.

4️⃣ Session Strategy

```
session: {
strategy: "jwt",
},
```

Meaning
Strategy Description
jwt Stateless, fast, best for Next.js
database Stores sessions in DB

✔ JWT is perfect for ERP dashboards
✔ No session table lookup on every request

5️⃣ Providers (Login Methods)
🟢 Google OAuth

```
Google({
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),
```

Flow

User clicks “Login with Google”

Google verifies user

PrismaAdapter:

Creates user if not exists

Links Google account

User is logged in

✔ No password needed
✔ Secure
✔ Enterprise standard

🔵 Email + Password (Credentials)

```
Credentials({
name: "Email & Password",
credentials: {
email: { label: "Email", type: "email" },
password: { label: "Password", type: "password" },
},
```

Defines login form fields.

🔐 authorize() — THE MOST IMPORTANT PART

```
async authorize(credentials) {
if (!credentials?.email || !credentials?.password) {
return null;
}
```

✔ Reject empty login attempts

🔍 Find user in DB

```
const user = await prisma.users.findUnique({
where: { email: credentials.email },
});
```

Uses your ERP users table

Matches by email

❌ Reject invalid users

```
if (!user || !user.password_hash) return null;
```

Cases:

User doesn’t exist

Google-only user (no password)

🔐 Compare password

```
const isValid = await bcrypt.compare(
credentials.password,
user.password_hash
);

if (!isValid) return null;
```

✔ Secure password validation
✔ Never store plaintext passwords

✅ Return user object

```
return {
id: String(user.id),
email: user.email,
name: user.name,
role_id: user.role_id,
is_active: user.is_active,
};
```

⚠ Only returned fields go into JWT

6️⃣ Callbacks (JWT & Session)

Callbacks control what data flows where.

🔑 JWT Callback

```
async jwt({ token, user }) {
if (user) {
token.role_id = user.role_id;
token.is_active = user.is_active;
}
return token;
},
```

What happens here

Runs on login

Stores ERP-specific data in JWT

JWT now contains:

role_id

is_active

💡 JWT = source of truth

🧠 Session Callback

```
async session({ session, token }) {
if (session.user) {
session.user.role_id = token.role_id ?? null;
session.user.is_active = token.is_active ?? null;
}
return session;
},
```

Why this exists

Exposes JWT data to frontend

useSession() can now access:

session.user.role_id
session.user.is_active

7️⃣ Custom Pages

```
pages: {
signIn: "/login",
},
```

✔ Uses your custom ERP login page
✔ No default NextAuth UI

8️⃣ Export Auth Helpers

```
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
```

What each export does
Export Usage
handlers API routes (route.ts)
auth() Server-side auth check
signIn() Programmatic login
signOut() Logout
9️⃣ How This Fits Your ERP
ERP Need Solved By
Admin / Staff roles role_id
Disable user is_active
Google login OAuth
Email login Credentials
Secure auth JWT + bcrypt
Auditing (created_by) user.id
10️⃣ Real Usage Examples
Server Component

```
const session = await auth();

if (!session || !session.user.is_active) redirect("/login");
```

Client Component

```
const { data: session } = useSession();

if (session?.user.role_id === 1) {
// Admin access
}
```

✅ Summary

✔ One unified users table
✔ Google + Password login
✔ Fully typed
✔ ERP-ready
✔ Scalable to branches & warehouses
