'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import SideBar from '@/components/SideBar';
import Header from '@/components/Header';
import AddItemModal from './AddItemModal';
import { useState } from 'react';

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

  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-[20%]">
        <SideBar />
      </div>
      <div className="relative flex flex-col p-5 top-0 left-[20%] w-[80%]">
        <Header onClick={() => setOpen(true)} />
        {children}
      </div>
      <AddItemModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Slide-In Panel"
      />
    </>
  );
}
