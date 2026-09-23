import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  setupToken: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(12)
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());

  if (body.setupToken !== (process.env.ADMIN_SETUP_TOKEN || 'demo-token')) {
    return NextResponse.json({ error: 'Invalid setup token' }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    message: 'Admin account setup is ready. Use the secret setup token in production.'
  }, { status: 201 });
}
