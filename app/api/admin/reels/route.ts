import { NextRequest, NextResponse } from 'next/server';
import { getReels, createReel } from '@/lib/store';

export async function GET() {
  const reels = await getReels();
  return NextResponse.json(reels);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reel = await createReel(body);
  return NextResponse.json(reel, { status: 201 });
}
