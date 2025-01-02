'use client';

import { useState, useEffect } from 'react';
import { LucideAlignJustify, X, Home, Settings, LogOut, User, ArrowLeftRight, FileChartLine, StickyNote } from 'lucide-react'; 
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { checkUser } from '@/app/actions/checkUser';
import { signOutAction } from '@/app/actions/actions';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string | undefined;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode; 
}

function AdminNavbar() {
  const [menu, setMenu] = useState<boolean>(false); 
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkUser();
      setUser(userData?.user);
      setLoading(false);
    };

    fetchUser();

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleMenu = () => setMenu((prev) => !prev);

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/protected/admin/dashboard', icon: <Home /> },
    { label: 'Announcements', href: '/protected/admin/announcements', icon: <StickyNote /> },
    { label: 'Settings', href: '/protected/admin/settings', icon: <Settings /> },
    { label: 'Analytics', href: '/protected/admin/analytics', icon: <FileChartLine /> },
  ];

  const handleLogout = () => {
    setIsDialogOpen(true);
  };

  const confirmLogout = async () => {
    const toastId = toast.loading('Logging out...');
    const result = await signOutAction();

    toast.dismiss(toastId);

    if (result.success) {
      setUser(null);
      setMenu(false);
      setIsDialogOpen(false);
      toast.success('Logged out successfully.');
      window.location.href = '/sign-in';
    } else {
      toast.error('Failed to log out. Please try again.');
    }
  };

  const cancelLogout = () => {
    setIsDialogOpen(false);
  };

  const handleSwitch = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen p-4 flex flex-col ${
          isMobile ? (menu ? 'w-64' : 'w-16') : 'w-64'
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/deped-ifugao-logo.png"
                alt="Admin Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <div>
              <h1
                className={`text-lg font-bold text-blue-700 ${
                  isMobile && !menu ? 'hidden' : 'block'
                }`}
              >
                SGODOSS Admin
              </h1>
            </div>
          </div>
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <div onClick={toggleMenu} className="cursor-pointer text-xl">
              {menu ? <X /> : <LucideAlignJustify />}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-6 flex-grow">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`block text-white py-2 px-4 flex items-center gap-4 ${
                pathname === item.href ? 'bg-blue-600' : 'hover:bg-blue-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isMobile || menu ? <span>{item.label}</span> : null}
            </Link>
          ))}
        </div>

      <div className="mt-auto">
        {loading ? (
          <Button className="mt-4 w-full bg-gray-400 text-white" disabled>
            Loading...
          </Button>
        ) : user === null ? (
          <a href="/sign-in" className="w-full">
            <Button className="w-full bg-blue-800 text-white">Login</Button>
          </a>
        ) : (
          <>
            <Link
              href="#"
              className={`block text-gray-400 py-1 px-2 text-sm flex items-center gap-2 ${
                pathname === '#' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
              onClick={handleSwitch}
            >
              <span className="text-lg">
                <ArrowLeftRight />
              </span>
              {!isMobile || menu ? <span>Switch to Client View</span> : null}
            </Link>
            <Link
              href="#"
              className={`block text-gray-400 py-1 px-2 text-sm flex items-center gap-2 ${
                pathname === '#' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
              onClick={handleLogout}
            >
              <span className="text-lg">
                <LogOut />
              </span>
              {!isMobile || menu ? <span>Logout</span> : null}
            </Link>
          </>
        )}
      </div>


      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
          <div className="flex justify-end gap-4">
            <Button onClick={cancelLogout} className="bg-gray-500 text-white">
              Cancel
            </Button>
            <Button onClick={confirmLogout} className="bg-red-600 text-white">
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminNavbar;
