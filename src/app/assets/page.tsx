'use client';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

export default function AssetsPage() {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <BellIcon className="h-5 w-5" />
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            + New Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
