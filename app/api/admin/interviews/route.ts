import { NextRequest, NextResponse } from 'next/server';
import { getInterviews, createInterview } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getInterviews());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const interview = createInterview(body);
  return NextResponse.json(interview, { status: 201 });
}
