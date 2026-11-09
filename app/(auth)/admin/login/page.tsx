"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminCopyProtection from "../../../admin/AntiCopyProtection";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Login unsuccessful");
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!admin) {
        await supabase.auth.signOut();
        throw new Error("This account is not registered as an admin");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fail");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-protected grid min-h-screen place-items-center bg-[#080b14] p-5 text-white">
      <AdminCopyProtection />

      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-[#101726] p-8"
      >
        <Link href="/" className="text-sm text-violet-300">
          Go back to Home
        </Link>

        <div>
          <h1 className="mt-2 text-2xl font-bold">
            NextCAD Studio Membership
          </h1>
          <p className="mt-2 text-slate-400">Login</p>
        </div>

        <label className="block text-sm text-slate-300">
          Email :
          <input
            className="mt-2 block w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-white"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block text-sm text-slate-300">
          Password :
          <input
            className="mt-2 block w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-white"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-rose-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="primary w-full"
        >
          {busy ? "Checking" : "Login"}
        </button>
      </form>
    </main>
  );
}