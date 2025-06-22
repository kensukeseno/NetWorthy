import { useState } from 'react';
type SideBarItemProps = {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
};

export default function SideBarItem({ Icon, name }: SideBarItemProps) {
  const [isActive, setActive] = useState(false);

  return (
    <button
      className={`${isActive && 'text-blue-500 bg-blue-50 rounded-sm'} flex flex-row gap-2 items-center p-2 w-full`}
    >
      <Icon className="h-6 w-6" />
      <span>{name}</span>
    </button>
  );
}
