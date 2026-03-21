import { NextRequest, NextResponse } from 'next/server';
import { getSponsors, updateSponsor, deleteSponsor } from '@/lib/store';

// Helper: find sponsor by positional id (seed) or explicit id field
function findSponsorById(id: string) {
  const all = getSponsors();
  // First try explicit id field
  const byField = all.find((s) => (s as { id?: string }).id === id);
  if (byField) return byField;
  // Fall back to 1-based index for seed data
  const idx = parseInt(id, 10) - 1;
  return all[idx] ?? null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sponsor = findSponsorById(id);
  if (!sponsor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ id, ...sponsor });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  // Try update by explicit id first
  let updated = updateSponsor(id, body);
  if (!updated) {
    // Seed sponsors lack id field — patch by index
    const all = getSponsors();
    const idx = parseInt(id, 10) - 1;
    if (idx >= 0 && idx < all.length) {
      (all[idx] as { id?: string }).id = id; // assign id so updateSponsor can find it
      updated = updateSponsor(id, body);
    }
  }
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Ensure seed sponsors have ids before deleting
  const all = getSponsors();
  const idx = parseInt(id, 10) - 1;
  if (idx >= 0 && idx < all.length && !(all[idx] as { id?: string }).id) {
    (all[idx] as { id?: string }).id = id;
  }
  const ok = deleteSponsor(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
