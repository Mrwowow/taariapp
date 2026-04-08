import { NextRequest, NextResponse } from 'next/server';
import { getChangeMakers, createChangeMaker } from '@/lib/store';

export async function GET() {
  const makers = await getChangeMakers();
  return NextResponse.json(makers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const maker = await createChangeMaker(body);
  return NextResponse.json(maker, { status: 201 });
}
