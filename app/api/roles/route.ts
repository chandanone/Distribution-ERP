import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const roles = await prisma.roles.findMany({
    select: { id: true, name: true },
  });
  return NextResponse.json(roles);
}
