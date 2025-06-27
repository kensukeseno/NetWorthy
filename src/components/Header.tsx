import React from 'react';
import {
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <div className="flex flex-row justify-between">
      <div className="text-2xl font-medium">Welcome Back, [name]</div>
      <div className="flex flex-row gap-1 items-center">
        <MagnifyingGlassIcon className="h-5 w-5" />
        <BellIcon className="h-5 w-5" />
        <button className="h-6 w-6">
          <PlusIcon className="text-white bg-blue-600 rounded-2xl p-1" />
        </button>
      </div>
    </div>
  );
}
