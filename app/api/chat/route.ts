import { NextRequest } from "next/server";

const ENDPOINT = process.env.N8N_WEBHOOK!;

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, sessionId, userId } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ success: false, output: "Prompt wajib diisi." }, { status: 400 });
    }

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, sessionId, userId }),
      signal: AbortSignal.timeout(300_000) // 5 menit
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return Response.json({ success: false, output: `Upstream ${res.status}: ${text}` }, { status: 502 });
    }

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      return Response.json(await res.json());
    }

    const text = await res.text();
    return Response.json({ success: true, output: text });
  } catch (e: unknown) {
    return Response.json({ success: false, output: errMsg(e) }, { status: 500 });
  }
}
