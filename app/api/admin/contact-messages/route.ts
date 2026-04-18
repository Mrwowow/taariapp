import { NextResponse } from 'next/server';
import { getContactMessages } from '@/lib/store';

export async function GET() {
  const messages = await getContactMessages();
  return NextResponse.json(messages);
}
