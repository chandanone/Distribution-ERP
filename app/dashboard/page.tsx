// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // ✅ AUTH PASSED
  return (
    <div>
      Welcome {session.user?.email}
    </div>
  );
}
