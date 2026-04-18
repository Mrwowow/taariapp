import { NextRequest, NextResponse } from 'next/server';
import { getPartnerships, createPartnership } from '@/lib/store';

export async function GET() {
  const partnerships = await getPartnerships();
  return NextResponse.json(partnerships);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const partnership = await createPartnership(body);
  return NextResponse.json(partnership, { status: 201 });
}
