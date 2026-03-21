import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getUsers());
}

export async function POST(request: Request) {
  const data = await request.json();
  const { name, email, role, city, avatar } = data;

  if (!name || !email || !role) {
    return NextResponse.json({ error: 'name, email and role are required' }, { status: 400 });
  }

  const user = createUser({
    id: Date.now().toString(),
    name,
    email,
    role: role ?? 'reader',
    status: 'active',
    city: city ?? '',
    joinedAt: new Date().toISOString(),
    avatar: avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128`,
  });

  return NextResponse.json(user, { status: 201 });
}
