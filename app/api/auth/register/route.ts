import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  const data = await request.json();
  const { name, email, password, city } = data;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  // Check if email already exists
  const [existing] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM users WHERE email = ?', [email]
  );
  if (existing.length > 0) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password_hash, role, status, city, avatar)
     VALUES (?, ?, ?, 'reader', 'active', ?, ?)`,
    [
      name,
      email,
      passwordHash,
      city || '',
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=C9A84C&color=0D0D0B`,
    ]
  );

  return NextResponse.json({
    success: true,
    user: { id: result.insertId, name, email, role: 'reader' },
  }, { status: 201 });
}
