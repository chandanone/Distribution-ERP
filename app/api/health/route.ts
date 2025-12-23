import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Adjust the path based on your folder structure

export async function GET() {
  try {
    // Replace 'user' with whatever model you have in your schema.prisma
    const userCount = await prisma.customers.count();

    return NextResponse.json({
      status: "ERP API running",
      databaseConnection: "Success",
      totalUsers: userCount,
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { status: "Error", message: "Failed to connect to database" },
      { status: 500 }
    );
  }
}
