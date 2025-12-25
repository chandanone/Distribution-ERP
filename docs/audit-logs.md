🧾 WHAT IS AN AUDIT LOG (ERP CONTEXT)

Audit log answers:

Question Example
Who User ID 12
What CREATED_INVOICE
Which record invoice_id = 101
When 2025-01-10 14:32
From where IP, user agent
Old → New status: DRAFT → POSTED
🏗️ ARCHITECTURE (RECOMMENDED)
✅ Application-level audit logging

❌ NOT DB triggers
❌ NOT Prisma middleware for everything

Why?

You need business context

You need user/session info

You need old vs new values

🗄️ STEP 1 — AUDIT LOG TABLE
📄 Prisma Model
model audit_logs {
id Int @id @default(autoincrement())
user_id Int?
action String @db.VarChar(50)
entity String @db.VarChar(50)
entity_id Int?
old_data Json?
new_data Json?
ip_address String? @db.VarChar(45)
user_agent String?
created_at DateTime @default(now())

users users? @relation(fields: [user_id], references: [id])
}

✔ JSON for flexibility
✔ Nullable user (system jobs)
✔ No foreign key hard dependency

Run migration:

npx prisma migrate dev -n audit_logs

🧠 STEP 2 — AUDIT LOG HELPER
📄 lib/audit.ts
import { prisma } from "@/lib/db";

interface AuditLogInput {
userId?: number;
action: string;
entity: string;
entityId?: number;
oldData?: unknown;
newData?: unknown;
ip?: string;
userAgent?: string;
}

export async function logAudit({
userId,
action,
entity,
entityId,
oldData,
newData,
ip,
userAgent,
}: AuditLogInput) {
await prisma.audit_logs.create({
data: {
user_id: userId,
action,
entity,
entity_id: entityId,
old_data: oldData,
new_data: newData,
ip_address: ip,
user_agent: userAgent,
},
});
}

✔ Centralized
✔ Reusable
✔ Testable

🔐 STEP 3 — CAPTURE USER + REQUEST META

Inside API routes:

const session = await auth();

const ip =
req.headers.get("x-forwarded-for") ??
req.headers.get("x-real-ip");

const userAgent = req.headers.get("user-agent");

🔁 STEP 4 — USE IT IN REAL APIs
🟢 CREATE EXAMPLE (Vendor)
const vendor = await prisma.vendors.create({
data: {
...data,
created_by: Number(session.user.id),
},
});

await logAudit({
userId: Number(session.user.id),
action: "CREATE_VENDOR",
entity: "vendors",
entityId: vendor.id,
newData: vendor,
ip,
userAgent,
});

🟡 UPDATE EXAMPLE (Invoice Status Change)
const oldInvoice = await prisma.invoices.findUnique({
where: { id },
});

const updatedInvoice = await prisma.invoices.update({
where: { id },
data: { status: "POSTED" },
});

await logAudit({
userId: Number(session.user.id),
action: "POST_INVOICE",
entity: "invoices",
entityId: id,
oldData: oldInvoice,
newData: updatedInvoice,
ip,
userAgent,
});

🔴 DELETE EXAMPLE (Soft Delete)
await prisma.customers.update({
where: { id },
data: { deleted_at: new Date() },
});

await logAudit({
userId: Number(session.user.id),
action: "DELETE_CUSTOMER",
entity: "customers",
entityId: id,
});

⚠️ IMPORTANT ERP RULES
❌ DO NOT

Log every SELECT

Log Prisma middleware blindly

Log passwords or secrets

✅ DO

Log state-changing actions

Log financial events

Log inventory movements

Log approvals / rejections

🧾 ACTION NAMING STANDARD

Use consistent enums:

CREATE_VENDOR
UPDATE_VENDOR
CREATE_PO
APPROVE_PO
CREATE_GRN
POST_INVOICE
RECEIVE_PAYMENT
CANCEL_INVOICE
ADJUST_STOCK

This makes reports easy.

📊 STEP 5 — AUDIT LOG VIEW API
GET /api/audit-logs?entity=invoices&entity_id=101

Prisma:

await prisma.audit_logs.findMany({
where: {
entity: "invoices",
entity_id: 101,
},
orderBy: { created_at: "desc" },
});

🔒 STEP 6 — ACCESS CONTROL

Only:

Admin

Auditor

Accounts Head

requireRole(ROLE.ADMIN, session.user.role_id);

🏁 FINAL BEST PRACTICE SUMMARY
Topic Best Practice
Where to log API layer
What to log Business events
Format JSON old/new
Who From session
When After transaction success
🚀 NEXT RECOMMENDED ADD-ONS

1️⃣ Inventory movement auto-logging
2️⃣ Approval workflow logs
3️⃣ Immutable financial logs
4️⃣ Export audit logs (CSV)
