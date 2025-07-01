import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  console.log('Reset password request received for token:', token ? 'present' : 'missing');
  
  if (!token || !password) {
    console.log('Missing token or password');
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
  }

  // Find user by reset token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  });
  
  console.log('User found:', user ? 'yes' : 'no');
  if (user) {
    console.log('User email:', user.email);
    console.log('Token expiry:', user.resetTokenExpiry);
  }
  
  if (!user) {
    console.log('Invalid or expired token');
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  // Hash new password
  const hashed = await bcrypt.hash(password, 10);
  console.log('Password hashed successfully');

  // Update user password and clear reset token fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
  
  console.log('User password updated successfully');

  return NextResponse.json({ success: true });
} 