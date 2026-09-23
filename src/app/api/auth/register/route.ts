import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const email = body.email?.toLowerCase();
  const phone = body.phone;

  if ((!email && !phone) || !body.password) {
    return NextResponse.json({ error: 'Provide email or phone and password' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: 'Demo login successful' });
}
