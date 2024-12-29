'use client';

import { useState, useEffect } from 'react';
import { LucideAlignJustify, X } from 'lucide-react';
import Image from 'next/image';
import ModeToggle from '../mode-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { checkUser } from '@/app/actions/checkUser';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { signOutAction } from '@/app/actions/actions';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string | undefined;
}

interface NavItem {
  label: string;
  href: string;
}

function NavBar() {
  const [menu, setMenu] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkUser();
      setUser(userData?.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const toggleMenu = () => setMenu((prev) => !prev);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' },
    { label: 'Announcements', href: '/announcements' },
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
    } else {
      toast.error('Failed to log out. Please try again.');
    }
  };

  const cancelLogout = () => {
    setIsDialogOpen(false);
  };

  const handleSwitch = () => {
    window.location.href = '/protected/admin/dashboard';
  };

  return (
    <div className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-md dark:bg-card shadow-md border-b dark:border-neutral-800">
      {/* Mobile Navbar */}
      <div className="block lg:hidden h-[50px]">
        <div className="flex justify-between items-center px-4 h-full">
          <Image
            src="/deped-ifugao-logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="h-10 w-10"
          />
          <div className="flex items-center gap-3">
            {menu ? (
              <X
                className="cursor-pointer text-xl dark:text-white text-black"
                onClick={toggleMenu}
              />
            ) : (
              <LucideAlignJustify
                className="cursor-pointer text-xl"
                onClick={toggleMenu}
              />
            )}
            <ModeToggle />
          </div>
        </div>

        {menu && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-card shadow-md">
            <nav className="flex flex-col items-start py-3 gap-3 px-5">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-gray-700 dark:text-gray-300 font-medium ${pathname === item.href ? 'underline text-blue-500' : 'hover:text-blue-500'}`}
                  onClick={() => setMenu(false)}
                >
                  {item.label}
                </Link>
              ))}

              {loading ? (
                <Button className="w-full bg-gray-400 text-white" disabled>
                  Loading...
                </Button>
              ) : user === null ? (
                <a href="/sign-in" className="w-full">
                  <Button className="w-full bg-blue-800 text-white">Login</Button>
                </a>
              ) : (
                <Accordion type="single" collapsible>
                  <AccordionItem value="user-options">
                    <AccordionTrigger>View Other Options</AccordionTrigger>
                    <AccordionContent className="gap-6">
                      <Button onClick={handleSwitch} className="w-full text-left bg-blue-800 mb-2">
                        Switch to Admin View
                      </Button>
                      <Button onClick={handleLogout} className="w-full bg-red-600 text-white">
                        Logout
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:block p-2">
        <div className="flex justify-between mx-4 md:mx-8 items-center">
          <div className="flex items-center">
            <Image
              src="/deped-ifugao-logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="h-auto max-w-12 max-h-12"
            />
            <span className="ml-2 text-xl font-semibold text-blue-800 dark:text-blue-800">
              SGODOSS
            </span>
          </div>

          <div className="flex justify-center gap-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`cursor-pointer font-medium text-gray-600 dark:text-gray-300 ${pathname === item.href ? 'underline text-blue-500' : 'hover:text-blue-600'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <Button className="bg-gray-400 text-white" disabled>
                Loading
              </Button>
            ) : user === null ? (
              <a href="/sign-in">
                <Button className="bg-blue-800 text-white">Login</Button>
              </a>
            ) : (
              <>
                <span className="text-gray-700 dark:text-gray-300">Hello, {user?.email}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Menu />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="gap-2">
                    <DropdownMenuItem onClick={handleSwitch}>Switch to Admin View</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
                        <ModeToggle />
          </div>
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

export default NavBar;
