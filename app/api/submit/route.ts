import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/store";

export async function POST(request: Request) {
  const data = await request.json();

  const { name, email, city, summary } = data;

  if (!name || !email || !city || !summary) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  await createSubmission({
    name,
    email,
    city,
    summary,
    videoLink: data.videoLink ?? '',
    socialHandles: data.socialHandles ?? '',
    imageUrls: data.imageUrls ?? [],
  });

  return NextResponse.json({
    success: true,
    message: "Submission received. We'll review it and get back to you.",
  });
}
