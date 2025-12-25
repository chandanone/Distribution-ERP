🧱 BACKEND DEVELOPMENT SEQUENCE (STEP-BY-STEP)
🔹 PHASE 0 — Foundations (Do Once)
0.1 Repo & Tooling
npx create-next-app@latest pump-erp
cd pump-erp
npm install prisma @prisma/client zod bcrypt
npm install next-auth @auth/prisma-adapter
npm install -D prisma typescript

🔹 PHASE 1 — Database Setup (MOST IMPORTANT)
1️⃣ Design ER Diagram (✔ already done)

Entities:

users

roles

vendors

customers

products

warehouses

inventory

purchase_orders

grn

sales_orders

invoices

payments

warranty_cards

👉 Freeze schema before coding APIs

2️⃣ Prisma Init
npx prisma init

Creates:

/prisma
schema.prisma
migrations/
prisma.config.ts

3️⃣ Prisma Schema (Single Source of Truth)

Rules:

ERP users table = auth users

All audit fields use created_by

Use Int PKs for ERP tables

Use @relation explicitly

✔ You already fixed most issues here.

4️⃣ Migrate DB
npx prisma migrate dev -n init_erp

Verify:

Tables visible in Neon

No Prisma validation errors

🔹 PHASE 2 — Auth Layer (DO THIS EARLY)
5️⃣ Auth.js Setup

Files:

lib/auth.ts
lib/db.ts
types/next-auth.d.ts
app/api/auth/[...nextauth]/route.ts

✔ Google + Credentials
✔ JWT strategy
✔ role_id + is_active in session

👉 Auth before APIs (every API depends on it)

6️⃣ RBAC Helpers

Create:

lib/rbac.ts

export function requireRole(
roleId: number,
userRoleId: number | null
) {
if (userRoleId !== roleId) {
throw new Error("Unauthorized");
}
}

🔹 PHASE 3 — Validation Layer (Zod)
7️⃣ Zod Schemas (ONE PER ENTITY)

Folder:

/schemas
user.schema.ts
product.schema.ts
po.schema.ts
grn.schema.ts
invoice.schema.ts

Example:

export const createVendorSchema = z.object({
name: z.string().min(2),
gst_no: z.string().length(15),
phone: z.string().optional(),
});

✔ Zod = API firewall
✔ Never trust frontend

🔹 PHASE 4 — API Layer (App Router)
8️⃣ API Folder Structure
app/api/
vendors/
route.ts
products/
route.ts
purchase-orders/
route.ts
grn/
route.ts
sales-orders/
route.ts
invoices/
route.ts

9️⃣ API Pattern (STRICT)

Every API must:

Authenticate user

Check role

Validate input (Zod)

Run Prisma

Return response

Example:

const session = await auth();
if (!session) return unauthorized();

requireRole(ROLE.ADMIN, session.user.role_id);

const data = schema.parse(await req.json());

const result = await prisma.vendor.create({
data: {
...data,
created_by: Number(session.user.id),
},
});

🔹 PHASE 5 — Inventory & Accounting Logic
🔁 Inventory Flow
Action Inventory
GRN + stock
Invoice − stock
Return + stock
Cancel reverse

Use:

inventory_stock

inventory_movements

🔐 Transaction Safety

Always use:

await prisma.$transaction(async (tx) => {
// stock
// invoice
// payments
});

🔹 PHASE 6 — Seed Database (CRITICAL)
10️⃣ Seed Script
npx prisma db seed

Seed:

Roles (Admin, Sales, Accounts)

Admin user

Warehouses

Tax slabs

Transport modes

Example:

await prisma.roles.createMany({
data: [
{ id: 1, name: "ADMIN" },
{ id: 2, name: "SALES" },
],
});

🔹 PHASE 7 — Security & Hardening
11️⃣ Security Checklist

✔ Hash passwords
✔ Disable user login via is_active
✔ Validate all input
✔ Use server-only Prisma
✔ No secrets in client

🔹 PHASE 8 — Observability (Optional but Pro)
12️⃣ Add Logging
prisma.$use(async (params, next) => {
console.log(params.model, params.action);
return next(params);
});

🔹 PHASE 9 — Production Readiness
13️⃣ CI Safety

Before every commit:

npx tsc --noEmit
npx prisma validate

🧠 FINAL ARCHITECTURE FLOW
Client
↓
Zod Validation
↓
Auth (JWT + RBAC)
↓
Prisma Transaction
↓
PostgreSQL (Neon)

🔥 EXTRA (Highly Recommended)
⭐ Add these later

Soft delete (deleted_at)

Activity logs

Approval workflow (PO → GRN)

Multi-warehouse stock

PDF invoice generation
