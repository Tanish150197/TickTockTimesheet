"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push("/");
  }

  return (
    <header className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/90 px-6 py-4 shadow-sm shadow-slate-200/50 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-sm shadow-slate-900/10">
          tt
        </div>
        <div>
          <p className="text-sm text-slate-500">ticktock</p>
          <p className="text-sm font-semibold text-slate-950">Timesheets</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
          John Doe
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
