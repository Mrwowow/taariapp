import { NextRequest, NextResponse } from 'next/server';
import { getCities, createCity } from '@/lib/store';

export async function GET() {
  const cities = await getCities();
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const city = await createCity(body);
  return NextResponse.json(city, { status: 201 });
}
