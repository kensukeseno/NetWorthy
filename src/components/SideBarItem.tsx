import Link from 'next/link';

type SideBarItemProps = {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
  href: string;
  isActive: boolean;
};

export default function SideBarItem({ Icon, name, href, isActive }: SideBarItemProps) {
  return (
    <Link
      href={href}
      className={`${isActive ? 'text-blue-500 bg-blue-50 rounded-sm' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'} flex flex-row gap-2 items-center p-2 w-full transition-colors`}
    >
      <Icon className="h-6 w-6" />
      <span>{name}</span>
    </Link>
  );
}
