import { NextRequest, NextResponse } from 'next/server';
import { getContactMessageById, updateContactMessageStatus, deleteContactMessage } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const msg = await getContactMessageById(id);
  if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(msg);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await req.json();
  const updated = await updateContactMessageStatus(id, status);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ok = await deleteContactMessage(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
