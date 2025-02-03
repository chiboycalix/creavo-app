'use client';

import Link from 'next/link';
import { NavItem } from '@/types/navigation';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

interface SidebarProps {
  navItems: NavItem[];
}

export default function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`
        bg-white w-64 min-h-screen fixed top-0 left-0 bottom-0 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            <div className="px-4 mb-14">
              <div className="mb-6 mt-4 flex justify-start">
                <Link href="/" className="relative">
                  <Image
                    width={144}
                    height={50}
                    className="w-36"
                    src="/assets/icons/logo.png"
                    alt="STRIDEZ logo"
                    priority
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </Link>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors
                    ${isActive ? 'bg-primary-50' : ''}`}
                    >
                      <Icon
                        size={20}
                        className={`mr-3 ${isActive ? 'text-primary-500' : 'text-gray-500'}`}
                      />
                      <span className={isActive ? 'text-primary-500 font-medium' : 'text-gray-700'}>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </div>
          </ul>


          <div className="border-b mx-3 my-6" />

          <div className="mt-4 px-3 text-[11px] text-gray-500">
            <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
              <li className="hover:font-medium cursor-pointer transition-all">Company</li>
              <li className="hover:font-medium cursor-pointer transition-all">About</li>
              <li className="hover:font-medium cursor-pointer transition-all">Contact</li>
            </ul>
            <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
              <li className="hover:font-medium cursor-pointer transition-all">Help</li>
              <li className="hover:font-medium cursor-pointer transition-all">Safety</li>
              <li className="hover:font-medium cursor-pointer transition-all">Privacy Center</li>
              <li className="text-xs hover:font-medium cursor-pointer transition-all">
                Terms & Policies
              </li>
              <li className="text-xs hover:font-medium cursor-pointer transition-all">
                Community Guidelines
              </li>
            </ul>

            <p className="mt-2">© 2024 STRIDEZ</p>
          </div>

          <div className="pb-6" />
        </nav>
      </aside>
    </>
  );
}