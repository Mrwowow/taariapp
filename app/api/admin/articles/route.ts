import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getArticles());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const article = createArticle(body);
  return NextResponse.json(article, { status: 201 });
}
