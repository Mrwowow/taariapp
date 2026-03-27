import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsers } from '@/lib/store';
import pool from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { name, email, password, role, city, avatar } = data;

  if (!name || !email || !role || !password) {
    return NextResponse.json({ error: 'Name, email, password and role are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=C9A84C&color=0D0D0B`;

  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (name, email, password_hash, role, status, city, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, passwordHash, role ?? 'reader', 'active', city ?? '', userAvatar]
  );

  return NextResponse.json({
    id: String(result.insertId),
    name,
    email,
    role,
    status: 'active',
    city: city ?? '',
    avatar: userAvatar,
  }, { status: 201 });
}
