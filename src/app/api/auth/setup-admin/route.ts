import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  return NextResponse.json({
    ok: true,
    user: {
      name: body.name,
      email: body.email,
      phone: body.phone
    }
  }, { status: 201 });
}
