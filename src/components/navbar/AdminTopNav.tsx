'use client';

import React from 'react';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
// import { SignOut } from "@/app/(authentication)/login/actions";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AiOutlineUserSwitch } from 'react-icons/ai';

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/lib/utils';

import { useMediaQuery } from '@/hooks/use-media-query';

import {
	Home,
	LogOut,
	Menu,
	MessageCircleMore,
	Scroll,
	User as UserIcon,
	X,
	Heart,
	Wallet,
} from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';
import { IconExchange } from '@tabler/icons-react';
import { logout } from '@/app/auth/login/actions';
import { ModeToggle } from '../mode-toggle';

function AdminTopNav() {
	/*
        used useEffect and state so that all possible static routes stay static
    */
	const [user, setUser] = React.useState<User | null>(null);
	const [open, setOpen] = React.useState<boolean>(false);
	const isDesktop = useMediaQuery('(min-width: 980px)');

	const pathname = usePathname();

	// to check if user is logged in without being dynamic
	React.useEffect(() => {
		const { auth } = createClient();

		auth.getSession().then(({ data }) => {
			console.log(data);
			setUser(data.session?.user);
		});

		const { data: authListener } = auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN') {
				setUser(session?.user || null);
			} else if (event === 'SIGNED_OUT') {
				setUser(null);
			}
		});

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);

	// for scrolling while mobile
	React.useEffect(() => {
		if (open) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
		return () => {
			document.body.classList.remove('overflow-hidden');
		};
	}, [open]);

	return (
		<nav className='py-3 sticky z-[999] airBnbDesktop:z-999 top-0 w-full bg-white/95 shadow backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background'>
			<div className='w-full grid md1:grid-cols-3 grid-flow-col px-5'>
				<div className='flex flex-nowrap items-center justify-start h-11'>
					<Image
						src='/Logo.png'
						alt='UniHomes logo'
						width={120}
						height={120}
						priority
						className='w-14 h-14 object-contain aspect-square'
					/>
				</div>
				{/* Empty center for spacing */}
				<div className='hidden md:flex'></div>
				{isDesktop ? (
					<>
						<div className='flex flex-nowrap items-center justify-end gap-5'>
							<ModeToggle />
							{/* <NotificationPopover /> */}
							<Separator orientation='vertical' className='mx-2 bg-gray-300' />

							<div className='flex flex-nowrap items-center justify-end gap-2'>
								<Link
									href='/login'
									className={cn(
										buttonVariants({ variant: 'outline' }),
										'rounded-lg'
									)}
									onClick={async () => {
										await logout();
										window.location.href = '/';
									}}
								>
									Logout
								</Link>
							</div>
						</div>
					</>
				) : (
					// mobile view
					<div className='flex flex-nowrap items-center justify-end gap-2'>
						<>
							<ModeToggle />
							<NotificationPopover />
							<Separator
								orientation='vertical'
								className='ml-2 mr-1 bg-gray-300'
							/>
						</>
						<Link
							href='/login'
							className={cn(
								buttonVariants({ variant: 'outline' }),
								'rounded-lg'
							)}
							onClick={async () => {
								await logout();
								window.location.href = '/';
							}}
						>
							Logout
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
}

export default AdminTopNav;
