import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserById, updateUser, deleteUser } from '@/lib/store';
import pool from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();

  // Handle password separately
  if (data.password && data.password.length >= 6) {
    const hash = await bcrypt.hash(data.password, 12);
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id]);
  }

  // Remove password from data before passing to updateUser
  const { password, ...rest } = data;
  const updated = await updateUser(id, rest);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteUser(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
