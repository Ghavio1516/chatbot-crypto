import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, displayName } = await req.json();
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ success: false, message: "Email/password tidak valid" }, { status: 400 });
    }

    const existing = await query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length) {
      return NextResponse.json({ success: false, message: "Email sudah dipakai" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query<{ id: string }>(
      "INSERT INTO users (email, display_name, password_hash) VALUES ($1,$2,$3) RETURNING id",
      [email, displayName ?? null, hash]
    );

    await setSession(rows[0].id);
    return NextResponse.json({ success: true, userId: rows[0].id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
