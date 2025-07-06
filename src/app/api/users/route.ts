// /app/api/users/route.ts

import { users } from '@/db/schema';
import { NextResponse } from 'next/server';

import argon2 from 'argon2';
import { db } from '@/db/db';

// GET all users
export async function GET() {
  const result = await db.select().from(users).orderBy(users.id);
  return NextResponse.json({ users: result });
}

// POST create user
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, role, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const hashedPassword = await argon2.hash(password);

  const inserted = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .returning();

  return NextResponse.json({ user: inserted[0] });
}
