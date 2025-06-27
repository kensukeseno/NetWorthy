import React from 'react';
import SideBarItem from './SideBarItem';
import {
  HomeIcon,
  PresentationChartLineIcon,
  CreditCardIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

type SideBarProps = {
  width?: string;
};

export default function SideBar({ width }: SideBarProps) {
  return (
    <div
      className={`flex flex-col pt-5 ${width} h-screen border-r-4 border-gray-100 shadow`}
    >
      <div className="flex flex-row items-center gap-2 mb-6 w-[80%] mx-auto">
        <img src="images/logo.png" className="w-8 h-8" />
        <span>
          <span className="text-blue-500">NET</span>
          <span className="text-gray-400">WORTHY</span>
        </span>
      </div>
      <div className="w-[80%] mx-auto">
        <SideBarItem Icon={HomeIcon} name="Home" />
        <SideBarItem Icon={PresentationChartLineIcon} name="Assets" />
        <SideBarItem Icon={CreditCardIcon} name="Liabilities" />
        <SideBarItem Icon={Cog8ToothIcon} name="Settings" />
      </div>
    </div>
  );
}
