import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "postgres",
  max: 5,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 10_000,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  console.log("Session ID yang diterima:", sessionId);  // Debugging log

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query<{
      id: number;
      type: string | null;
      content: string | null;
    }>(
      `
      SELECT
        id,
        message->>'type' AS type,
        message->>'content' AS content
      FROM public.n8n_chat_histories
      WHERE session_id = $1
      ORDER BY id ASC
    `,
      [sessionId]
    );

    const messages = rows.map((r) => ({
      id: String(r.id),
      role: r.type === "human" ? "user" : "assistant",
      content: r.content ?? "",
    }));

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[/api/messages] DB error:", err);
    return NextResponse.json(
      { error: "Database error while fetching messages" },
      { status: 500 }
    );
  }
}
