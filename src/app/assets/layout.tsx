'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import SideBar from '@/components/SideBar';
import Header from '@/components/Header';

export default function AssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  // Every time the status value changes, check if the user is authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <>
      <div className="fixed top-0 left-0 w-[20%]">
        <SideBar />
      </div>
      <div className="relative flex flex-col p-5 top-0 left-[20%] w-[80%]">
        <Header hideWelcome={true} hideIcons={true} />
        {children}
      </div>
    </>
  );
} 