import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/store';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const msg = await createContactMessage({ name, email, subject, message });
  return NextResponse.json(msg, { status: 201 });
}
