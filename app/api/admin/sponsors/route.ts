import { NextRequest, NextResponse } from 'next/server';
import { getSponsors, createSponsor } from '@/lib/store';

export async function GET() {
  const sponsors = await getSponsors();
  return NextResponse.json(sponsors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sponsor = await createSponsor(body);
  return NextResponse.json(sponsor, { status: 201 });
}
