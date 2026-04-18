import { NextRequest, NextResponse } from 'next/server';
import { getTeamMembers, createTeamMember } from '@/lib/store';

export async function GET() {
  const members = await getTeamMembers();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const member = await createTeamMember(body);
  return NextResponse.json(member, { status: 201 });
}
