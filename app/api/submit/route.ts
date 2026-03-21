import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const { name, email, city, summary } = data;

  if (!name || !email || !city || !summary) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  // In production: store in Sanity as submission document
  // const result = await sanityClient.create({ _type: 'submission', ...data, status: 'pending' })

  return NextResponse.json({
    success: true,
    message: "Submission received. We'll review it and get back to you.",
  });
}
