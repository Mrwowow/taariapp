import { NextRequest, NextResponse } from 'next/server';
import { getReelById, updateReel, deleteReel } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reel = await getReelById(id);
  if (!reel) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(reel);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await updateReel(id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ok = await deleteReel(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
