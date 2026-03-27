import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  city: string;
  avatar: string;
  password_hash: string | null;
}

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Find user
  const [rows] = await pool.execute<UserRow[]>(
    'SELECT * FROM users WHERE email = ?', [email]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const user = rows[0];

  // Check if user has a password set
  if (!user.password_hash) {
    return NextResponse.json({ error: 'Please set a password first or use social login' }, { status: 401 });
  }

  // Check if account is suspended
  if (user.status === 'suspended') {
    return NextResponse.json({ error: 'Your account has been suspended' }, { status: 403 });
  }

  // Verify password
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Set session cookie (simple token — in production use JWT or next-auth)
  const sessionToken = Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set('taari_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      avatar: user.avatar,
    },
  });
}
