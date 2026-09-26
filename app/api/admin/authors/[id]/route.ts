import { NextRequest, NextResponse } from 'next/server';
import { getAuthorByIdPublic, updateAuthor, deleteAuthor } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const author = await getAuthorByIdPublic(id);
  if (!author) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(author);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  if ((body.name !== undefined && !String(body.name).trim()) || (body.slug !== undefined && !String(body.slug).trim())) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
  }
  try {
    const updated = await updateAuthor(id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    if ((err as { code?: string }).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'An author with this slug already exists' }, { status: 409 });
    }
    throw err;
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await deleteAuthor(id);
  if (result === 'not_found') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (result === 'has_articles') {
    return NextResponse.json({ error: 'This author still has articles. Reassign them to another author first.' }, { status: 409 });
  }
  return NextResponse.json({ success: true });
}
