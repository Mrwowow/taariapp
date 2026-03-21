import { NextRequest, NextResponse } from 'next/server';
import { getReels, createReel } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getReels());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reel = createReel(body);
  return NextResponse.json(reel, { status: 201 });
}
