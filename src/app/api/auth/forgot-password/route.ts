import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../../../lib/sendEmail';
import prisma from '../../../../../lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // 1. Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'This email is not recognized.' }, { status: 404 });
  }

  // 2. Generate a reset token and expiry (1 hour from now)
  const token = Math.random().toString(36).substr(2);
  const expiry = new Date(Date.now() + 60 * 60 * 1000);

  // 3. Update user with reset token and expiry
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  // 4. Send email with reset link
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login/reset-password?token=${token}`;
  let previewUrl = null;
  try {
    const info = await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
          <h2 style="color: #2563eb;">NetWorthy Password Reset</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 24px; font-size: 12px; color: #888;">If you did not request this, you can safely ignore this email.</p>
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} NetWorthy</p>
        </div>
      `
    });
    if (process.env.NODE_ENV === 'development') {
      previewUrl = nodemailer.getTestMessageUrl(info);
    }
  } catch (err) {
    console.error('Error sending password reset email:', err);
  }

  return NextResponse.json({ success: true, previewUrl });
} 