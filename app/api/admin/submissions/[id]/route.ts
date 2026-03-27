import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionStatus } from '@/lib/store';
import type { Submission } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const submission = await getSubmissionById(id);
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(submission);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const status = body.status as Submission['status'];
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const updated = await updateSubmissionStatus(id, status);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}
