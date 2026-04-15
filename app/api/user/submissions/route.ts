import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSubmissionsByEmail } from '@/lib/store';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('taari_session');

  if (!session?.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = JSON.parse(Buffer.from(session.value, 'base64').toString());
    const submissions = await getSubmissionsByEmail(user.email);
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
