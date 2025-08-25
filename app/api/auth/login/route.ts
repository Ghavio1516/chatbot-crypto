import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email/password wajib" }, { status: 400 });
    }

    const { rows } = await query<{ id: string; password_hash: string }>(
      "SELECT id, password_hash FROM users WHERE email=$1",
      [email]
    );
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ success: false, message: "Email atau password salah" }, { status: 401 });
    }

    await setSession(user.id); // Menyimpan user ID ke sesi menggunakan session cookie
    return NextResponse.json({ success: true, userId: user.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
