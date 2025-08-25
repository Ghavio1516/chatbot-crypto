"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Menggunakan router untuk navigasi

  const submit = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMsg(data.message || (data.success ? "Login sukses" : "Login gagal"));
      if (data.success) window.location.href = "/"; // optional redirect
    } catch {
      setMsg("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6 space-y-3">
      <h1 className="text-xl font-semibold">Login</h1>
      <input 
        className="w-full border p-2 rounded" 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        className="w-full border p-2 rounded" 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      <button 
        className="w-full h-10 rounded bg-neutral-900 text-white disabled:opacity-50" 
        disabled={loading} 
        onClick={submit}
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>

      {msg && <p className="text-sm">{msg}</p>}

      <p className="text-center text-sm mt-4">
        Belum punya akun? 
        <span 
          className="text-blue-600 cursor-pointer" 
          onClick={() => router.push("/register")} // Navigasi ke halaman register
        >
          Daftar di sini
        </span>
      </p>
    </div>
  );
}
