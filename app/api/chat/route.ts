import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth"; 

const N8N_WEBHOOK = process.env.N8N_WEBHOOK;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "User not logged in" }, { status: 401 });
  }

  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
  }

  if (!N8N_WEBHOOK) {
    return NextResponse.json({ success: false, message: "N8N_WEBHOOK is not defined" }, { status: 500 });
  }
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        userId: user.id,  
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ success: false, output: `N8N error: ${text}` }, { status: 502 });
    }

    const responseBody = await response.json();
    return NextResponse.json({ success: true, output: responseBody });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error connecting to N8N" }, { status: 500 });
  }
}
