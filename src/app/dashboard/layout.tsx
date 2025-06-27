'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import SideBar from '@/components/SideBar';
import Header from '@/components/Header';

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

  return (
    <div className="flex flex-row">
      <SideBar width="w-[20%]" />
      <div className="flex flex-col p-5 w-[80%]">
        <Header />
        {children}
      </div>
    </div>
  );
}
