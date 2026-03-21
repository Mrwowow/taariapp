import { NextRequest, NextResponse } from 'next/server';
import { getSponsors, createSponsor } from '@/lib/store';

export async function GET() {
  // Ensure all sponsors have ids (seed data doesn't have them — assign on the fly)
  const sponsors = getSponsors().map((s, i) => ({
    id: (s as { id?: string }).id ?? String(i + 1),
    ...s,
  }));
  return NextResponse.json(sponsors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sponsor = createSponsor({ id: Date.now().toString(), ...body });
  return NextResponse.json(sponsor, { status: 201 });
}
