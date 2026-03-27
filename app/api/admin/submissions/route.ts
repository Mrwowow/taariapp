import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/store';

export async function GET() {
  const submissions = await getSubmissions();
  return NextResponse.json(submissions);
}
