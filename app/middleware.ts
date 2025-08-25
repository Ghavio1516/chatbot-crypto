import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookie = cookies().get('uid'); // Mendapatkan `uid` dari cookie
  if (!cookie) {
    // Jika `uid` tidak ada, redirect ke halaman login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Cek jika user valid di backend dengan `auth/me`
  const res = await fetch(`${process.env.BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${cookie.value}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika backend merespons false (user tidak valid)
  if (!data.success || !data.authenticated) {
    const cookieStore = await cookies();
    cookieStore.set('uid', '', { path: '/', maxAge: 0 });  // Hapus cookie 'uid'
    cookieStore.set('session', '', { path: '/', maxAge: 0 }); // Hapus cookie 'session'

    return NextResponse.redirect(new URL('/login', req.url)); // Redirect ke halaman login
  }

  // Jika user valid, lanjutkan permintaan ke halaman utama
  return NextResponse.next();
}

// Tentukan routes yang ingin diproteksi
export const config = {
  matcher: ['/'], // Ganti dengan path yang ingin diproteksi
};
