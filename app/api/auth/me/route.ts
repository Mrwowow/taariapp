import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('taari_session');

  if (!session?.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = JSON.parse(Buffer.from(session.value, 'base64').toString());
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
