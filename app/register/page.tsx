"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, password }),
      });
      const data = await res.json();
      setMsg(data.message || (data.success ? "Berhasil register & auto-login" : "Gagal register"));
      if (data.success) window.location.href = "/"; // optional redirect
    } catch {
      setMsg("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6 space-y-3">
      <h1 className="text-xl font-semibold">Register</h1>
      <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="Display name (opsional)" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
      <input className="w-full border p-2 rounded" type="password" placeholder="Password (min 8)" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full h-10 rounded bg-neutral-900 text-white disabled:opacity-50" disabled={loading} onClick={submit}>
        {loading ? "Mendaftar..." : "Daftar"}
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
