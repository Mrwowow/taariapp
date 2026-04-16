import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/store";
import {
  sendMail,
  submissionConfirmationTemplate,
  submissionAdminNotificationTemplate,
} from "@/lib/mailer";

export async function POST(request: Request) {
  const data = await request.json();

  const { name, email, country, state, city, summary } = data;

  if (!name || !email || !city || !summary) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  await createSubmission({
    name,
    email,
    country: country ?? '',
    state: state ?? '',
    city,
    summary,
    videoLink: data.videoLink ?? '',
    socialHandles: data.socialHandles ?? '',
    imageUrls: data.imageUrls ?? [],
  });

  const confirmTpl = submissionConfirmationTemplate(name);
  void sendMail({ to: email, subject: confirmTpl.subject, html: confirmTpl.html, text: confirmTpl.text });

  const adminTo = process.env.ADMIN_EMAIL;
  if (adminTo) {
    const adminTpl = submissionAdminNotificationTemplate({ name, email, city, summary });
    void sendMail({ to: adminTo, subject: adminTpl.subject, html: adminTpl.html, text: adminTpl.text, replyTo: email });
  }

  return NextResponse.json({
    success: true,
    message: "Submission received. We'll review it and get back to you.",
  });
}
