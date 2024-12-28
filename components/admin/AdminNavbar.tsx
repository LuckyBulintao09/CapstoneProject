"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling

function AdminNavbar() {
  const pathname = usePathname(); // To get the current path

  // Define your navigation items
  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Settings', href: '/admin/settings' },
    { label: 'Reports', href: '/admin/reports' },
  ];

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-[50] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href="/admin">
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${
                pathname === item.href ? 'text-blue-500' : 'text-white'
              } hover:text-blue-300 transition duration-200`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
