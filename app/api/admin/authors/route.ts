import { NextRequest, NextResponse } from 'next/server';
import { getAuthors, createAuthor } from '@/lib/store';

export async function GET() {
  const authors = await getAuthors();
  return NextResponse.json(authors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
  }
  try {
    const author = await createAuthor(body);
    return NextResponse.json(author, { status: 201 });
  } catch (err) {
    if ((err as { code?: string }).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'An author with this slug already exists' }, { status: 409 });
    }
    throw err;
  }
}
