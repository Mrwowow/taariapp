import { NextRequest, NextResponse } from 'next/server';
import { getInterviews, createInterview } from '@/lib/store';

export async function GET() {
  const interviews = await getInterviews();
  return NextResponse.json(interviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const interview = await createInterview(body);
  return NextResponse.json(interview, { status: 201 });
}
