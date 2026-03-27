import { NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/lib/store";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const added = await addNewsletterSubscriber(email);
  if (!added) {
    return NextResponse.json({ success: true, message: "Already subscribed" });
  }

  return NextResponse.json({ success: true, message: "Subscribed successfully" });
}
