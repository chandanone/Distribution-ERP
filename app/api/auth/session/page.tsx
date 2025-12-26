"use client";

import { useSession } from "next-auth/react";

export default function TestSession() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>No session yet</p>;

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
