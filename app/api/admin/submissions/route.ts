import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getSubmissions());
}
