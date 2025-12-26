"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push("/dashboard"); // redirect on successful login
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <Link href="/">
        <h2 className="text-3xl font-bold">Sunny Enterprises</h2>
      </Link>

      <form
        onSubmit={handleEmailLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h3 className="text-xl font-semibold text-center">Login</h3>

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

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login with Email
        </button>

        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-gray-400">or</span>
        </div>

        <button
          type="button"
          className="w-full p-2 border rounded hover:bg-gray-50"
          onClick={() => signIn("google")}
        >
          Login with Google
        </button>

        <p className="text-center text-sm mt-2">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
