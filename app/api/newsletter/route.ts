import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // In production: call ConvertKit/Mailchimp API
  // const res = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, { ... })

  return NextResponse.json({ success: true, message: "Subscribed successfully" });
}
