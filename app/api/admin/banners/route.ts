import { NextRequest, NextResponse } from 'next/server';
import { getBanners, createBanner } from '@/lib/store';

export async function GET() {
  const banners = await getBanners();
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const banner = await createBanner(body);
  return NextResponse.json(banner, { status: 201 });
}
