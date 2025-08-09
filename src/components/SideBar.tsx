import React from 'react';
import Image from 'next/image';
import SideBarItem from './SideBarItem';
import {
  HomeIcon,
  PresentationChartLineIcon,
  CreditCardIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function SideBar() {
  const pathname = usePathname();

  return (
    <div
      className={`flex flex-col pt-5 h-screen border-r-4 border-gray-100 shadow`}
    >
      <div className="flex flex-row items-center gap-2 mb-6 w-[80%] mx-auto">
        <Image src="/images/logo.png" alt="NetWorthy logo" width={32} height={32} className="w-8 h-8" />
        <span>
          <span className="text-blue-500">NET</span>
          <span className="text-gray-400">WORTHY</span>
        </span>
      </div>
      <div className="w-[80%] mx-auto">
        <SideBarItem Icon={HomeIcon} name="Home" href="/dashboard" isActive={pathname === '/dashboard'} />
        <SideBarItem Icon={PresentationChartLineIcon} name="Assets" href="/assets" isActive={pathname === '/assets'} />
        <SideBarItem Icon={CreditCardIcon} name="Liabilities" href="/liabilities" isActive={pathname === '/liabilities'} />
        <SideBarItem Icon={Cog8ToothIcon} name="Settings" href="/settings" isActive={pathname === '/settings'} />
      </div>
    </div>
  );
}
