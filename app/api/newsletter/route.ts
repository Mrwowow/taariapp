import { NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/lib/store";
import { sendMail, newsletterWelcomeTemplate } from "@/lib/mailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof email !== "string") {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalized) || normalized.length > 300) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const added = await addNewsletterSubscriber(normalized);
  if (!added) {
    return NextResponse.json({ success: true, message: "Already subscribed" });
  }

  const tpl = newsletterWelcomeTemplate(normalized);
  void sendMail({ to: normalized, subject: tpl.subject, html: tpl.html, text: tpl.text });

  return NextResponse.json({ success: true, message: "Subscribed successfully" });
}
