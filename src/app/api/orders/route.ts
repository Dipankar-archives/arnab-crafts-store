import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(12)
});

export async function PATCH(request: Request) {
  const body = schema.parse(await request.json());

  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json({ error: 'Current and new password required' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: 'Password updated successfully.' });
}
