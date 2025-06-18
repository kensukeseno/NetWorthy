'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  // Every time the status value changes, check if the user is authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  if (status === 'loading') return <p>Loading...</p>;

  return <>{children}</>;
}
