"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Role = {
  id: number;
  name: string;
};

export default function RegisterPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const router = useRouter();

  // Fetch roles dynamically from API
  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
        if (data.length > 0) setRoleId(data[0].id);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!roleId) return;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, roleId }),
    });

    if (res.ok) {
      router.push("/login"); // redirect after successful registration
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={roleId ?? ""}
          onChange={(e) => setRoleId(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
