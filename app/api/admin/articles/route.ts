import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/store';

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const article = await createArticle(body);
  return NextResponse.json(article, { status: 201 });
}
