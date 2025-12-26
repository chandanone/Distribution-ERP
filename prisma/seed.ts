import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

async function main() {
  // Seed roles
  const roles = ["ADMIN", "MANAGER", "USER"];
  for (const name of roles) {
    await prisma.roles.upsert({
      where: { name },
      update: {},
      create: { name, permissions: name === "ADMIN" ? ["*"] : [] },
    });
  }
  console.log("Roles seeded ✅");

  // Seed default admin user
  const adminEmail = "admin@example.com";
  const adminExists = await prisma.users.findUnique({
    where: { email: adminEmail },
  });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminRole = await prisma.roles.findUnique({
      where: { name: "ADMIN" },
    });

    await prisma.users.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password_hash: hashedPassword,
        role_id: adminRole!.id,
        is_active: true,
      },
    });
    console.log("Admin user seeded ✅");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
