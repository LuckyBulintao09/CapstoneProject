'use client';

import { useState } from 'react';
import { LucideAlignJustify, X } from 'lucide-react';
import Image from 'next/image';
import ModeToggle from '../mode-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

function NavBar() {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname(); 

  const toggleMenu = () => setMenu((prev) => !prev);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Announcements', href: '/announcements' },
  ];

  return (
    <div className='md:sticky md:top-0 md:shadow-lg z-[50] bg-white bg-opacity-80 backdrop-blur-md dark:bg-card'>
      {/* MOBILE */}
      <div className='block lg:hidden shadow-sm fixed top-0 w-full z-[999] bg-white bg-opacity-80 backdrop-blur-md dark:bg-card h-[76px] p-0 m-0'>
        <div className='flex justify-between px-4 items-center h-full w-full'>
          <Image src='/deped-logo.png' alt='logo' width={80} height={28} />
          <div className='flex items-center gap-[10px]'>
            {menu ? (
              <X
                className='cursor-pointer dark:text-white text-black z-[999]'
                onClick={toggleMenu}
              />
            ) : (
              <LucideAlignJustify
                className='cursor-pointer'
                onClick={toggleMenu}
              />
            )}
            <div className='pr-2'>
              <ModeToggle />
            </div>
          </div>
        </div>

        {menu && (
          <div className='bg-white dark:bg-card py-4 w-full z-[999]'>
            <div className='flex flex-col gap-8 mt-8 mx-4'>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`cursor-pointer flex items-center gap-2 font-[500] text-gray ${
                    pathname === item.href ? 'underline text-blue-500' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className='hidden lg:block animate-in fade-in zoom-in p-4'>
        <div className='flex justify-between mx-2 md:mx-[30px] items-center'>
          <Image
            src='/deped-logo.png'
            alt='Logo'
            width={160}
            height={80}
            className='h-8 w-auto scale-[2]'
          />
          {/* Desktop Navbar Menu */}
          <div className='flex justify-center w-full gap-8'>
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`cursor-pointer flex items-center gap-2 font-[500] text-gray ${
                  pathname === item.href ? 'underline text-blue-800' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className='flex items-center gap-[2px]'>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
