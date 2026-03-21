import { NextRequest, NextResponse } from 'next/server';
import { getInterviewBySlug, updateInterview, deleteInterview } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const interview = getInterviewBySlug(slug);
  if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(interview);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await req.json();
  const updated = updateInterview(slug, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ok = deleteInterview(slug);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
