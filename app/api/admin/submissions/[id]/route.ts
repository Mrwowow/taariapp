import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionStatus } from '@/lib/store';
import type { Submission } from '@/lib/store';
import { sendMail, submissionRejectionTemplate } from '@/lib/mailer';

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

  let rejectionReason = '';
  if (status === 'rejected') {
    const raw = typeof body.rejectionReason === 'string' ? body.rejectionReason.trim() : '';
    if (!raw) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }
    if (raw.length > 2000) {
      return NextResponse.json({ error: 'Rejection reason is too long' }, { status: 400 });
    }
    rejectionReason = raw;
  }

  const updated = await updateSubmissionStatus(id, status, rejectionReason);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (status === 'rejected' && updated.email) {
    const tpl = submissionRejectionTemplate({ name: updated.name, reason: rejectionReason });
    void sendMail({ to: updated.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  }

  return NextResponse.json(updated);
}
