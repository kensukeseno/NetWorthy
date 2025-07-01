import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

async function getTransporter() {
  if (process.env.NODE_ENV === 'development') {
    if (!transporter) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
    return transporter;
  } else {
    if (!transporter) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return transporter;
  }
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com',
    to,
    subject,
    html,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
  }

  return info;
} 