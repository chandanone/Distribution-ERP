next-auth v4 @next-auth/prisma-adapter
auth.js v5 @auth/prisma-adapter
Never mix them.

The Core Problem (very important)

You are using:

✅ next-auth@4.24.13 ← v4

❌ @auth/prisma-adapter@2.11.1 ← v5 adapter

These DO NOT WORK TOGETHER.

Rule:
next-auth v4 ❌ cannot use @auth/_ packages
@auth/_ packages are for Auth.js v5 only
