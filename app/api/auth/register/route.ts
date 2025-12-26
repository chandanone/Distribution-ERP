import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, password, roleId } = await req.json();

  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser)
    return NextResponse.json({ error: "Email exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
      role_id: roleId,
      is_active: true,
    },
  });

  return NextResponse.json({ user });
}
