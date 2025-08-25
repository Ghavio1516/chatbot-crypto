import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST() {
  try {
    const c = await cookies();                        // ⬅️ await
    const token = c.get("session")?.value;
    if (token) {
      await query("DELETE FROM sessions WHERE token=$1", [token]);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await clearSession();                             // ⬅️ it's async now
  }
  return NextResponse.json({ success: true });
}
