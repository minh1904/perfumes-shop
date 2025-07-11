import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import { db } from '@/db/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();
  const { name, email, role, password } = body;

  if (!name || !email) {
    return NextResponse.json({ message: 'Missing name or email' }, { status: 400 });
  }

  const allowedRoles = ['user', 'admin'] as const;
  const updateFields = {
    name,
    email,
    role: allowedRoles.includes(role) ? role : undefined,
  } as {
    name?: string;
    email?: string;
    role?: 'user' | 'admin';
    password?: string;
  };
  if (password) updateFields.password = await argon2.hash(password);

  await db.update(users).set(updateFields).where(eq(users.id, id));

  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  await db.delete(users).where(eq(users.id, id));

  return NextResponse.json({ success: true });
}
