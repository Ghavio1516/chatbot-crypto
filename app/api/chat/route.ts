import { NextRequest } from "next/server";

const ENDPOINT = process.env.N8N_WEBHOOK!;

export async function POST(req: NextRequest) {
  try {
    const { prompt, sessionId, userId } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ output: "error", detail: "Prompt wajib diisi." }, { status: 400 });
    }

    // kirim ke n8n (POST JSON) + timeout panjang (5–10 menit sesuai kebutuhan)
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, sessionId, userId }),
      signal: AbortSignal.timeout(300_000) // 5 menit; ubah ke 600_000 untuk 10 menit
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return Response.json({ output: "error", detail: `Upstream ${res.status}: ${text}` }, { status: 502 });
    }

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      // standar error dari n8n: { output: "error" }
      if (data?.output === "error") {
        return Response.json({ output: "error", detail: data?.detail ?? "Model gagal memproses prompt." });
      }
      return Response.json(data);
    }

    // fallback plain text
    const text = await res.text();
    return Response.json({ output: text });
  } catch (err: any) {
    return Response.json({ output: "error", detail: String(err?.message ?? err) }, { status: 500 });
  }
}
