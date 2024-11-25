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
	Briefcase,
	Building2,
	ChevronDown,
	Home,
	LibraryBig,
	Lightbulb,
	Menu,
	MessageCircleMore,
	Scroll,
	Settings,
	UserCircle2,
	X,
} from 'lucide-react';

function TopNavigation() {
	/*
        used useEffect and state so that all possible static routes stay static
    */
	const [user, setUser] = React.useState<User | null>(null);
	const [open, setOpen] = React.useState<boolean>(false);
	const isDesktop = useMediaQuery('(min-width: 950px)');

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
		<nav className='py-3 sticky z-[99] airBnbDesktop:z-10 top-0 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary'>
			<div className='w-full grid grid-flow-col px-5'>
				<div className='flex flex-nowrap items-center justify-start h-11'>
					<Image
						src='/Logo.png'
						alt='UniHomes logo'
						width={120}
						height={120}
						priority
						className='w-14 h-14 object-contain aspect-square'
					/>
					<span className='text-xl font-bold'>UniHomes</span>
				</div>
				{isDesktop ? (
					<>
						<ul className='flex flex-nowrap items-center justify-center gap-4'>
							<li>
								<Link
									href='/hosting'
									className={cn(
										buttonVariants({ variant: 'ghost' }),
										'rounded-full relative',
										"after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:bg-current after:rounded-full after:transition-all after:duration-200",
										pathname === '/hosting' ? 'after:w-8' : 'after:w-0',
										'hover:after:w-0'
									)}
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href='/hosting/properties'
									className={cn(
										buttonVariants({ variant: 'ghost' }),
										'rounded-full relative',
										"after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:bg-current after:rounded-full after:transition-all after:duration-200",
										pathname === '/hosting/properties'
											? 'after:w-8'
											: 'after:w-0',
										'hover:after:w-0'
									)}
								>
									Listings
								</Link>
							</li>
							<li>
								<Link
									href='/chat/inbox'
									className={cn(
										buttonVariants({ variant: 'ghost' }),
										'rounded-full relative',
										"after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:bg-current after:rounded-full after:transition-all after:duration-200",
										pathname === '/chat/inbox' ? 'after:w-8' : 'after:w-0',
										'hover:after:w-0'
									)}
								>
									Messages
								</Link>
							</li>
							<li>
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className={cn(
												'rounded-full inline-flex items-center gap-2 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-in-out [&_svg]:data-[state=open]:rotate-180 [&_svg]:data-[state=closed]:rotate-0 data-[state=open]:ring-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none'
											)}
										>
											<span>Menu</span>
											<ChevronDown className={`h-4 w-4`} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										side='bottom'
										align='start'
										className='border-none border-0 w-full min-w-[200px] px-0 py-5'
									>
										<DropdownMenuGroup>
											<DropdownMenuItem
												asChild
												className='py-2 px-3 rounded-none font-[500]'
											>
												<Link href={`/hosting/unit`}>Listings</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												asChild
												className='py-2 px-3 rounded-none font-[500]'
											>
												<Link href={`/hosting/property`}>Properties</Link>
											</DropdownMenuItem>
											<DropdownMenuItem className='py-2 px-3 rounded-none font-[500]'>
												Reservations
											</DropdownMenuItem>
											<DropdownMenuItem className='py-2 px-3 rounded-none font-[500]'>
												Insights
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</li>
						</ul>

						<div className='flex flex-nowrap items-center justify-end gap-11'>
							{/* Notification here */}
							{user ? (
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger className='rounded-full'>
										<Avatar className='w-11 h-11 select-none'>
											<AvatarImage src='' />
											<AvatarFallback className='text-base leading-none font-normal bg-primary text-white dark:text-foreground'>
												{user?.user_metadata.firstname.charAt(0).toUpperCase()}
												{user?.user_metadata.lastname.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										side='bottom'
										align='end'
										className='border-none border-0 w-full min-w-56 px-0 py-5'
										forceMount
									>
										<DropdownMenuLabel className='font-normal'>
											<div className='flex flex-col space-y-1'>
												<p className='text-sm font-medium leading-none truncate'>
													{user?.user_metadata.firstname}{' '}
													{user?.user_metadata.lastname}
												</p>
												<p className='text-xs leading-none text-muted-foreground truncate'>
													{user?.user_metadata.email}
												</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem
												asChild
												className='py-2 px-3 rounded-none font-[500]'
											>
												<Link href={`/hosting/profile`}>Profile</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												asChild
												className='py-2 px-3 rounded-none font-[500]'
											>
												<Link href={`/hosting/company`}>Company</Link>
											</DropdownMenuItem>
											<DropdownMenuItem className='py-2 px-3 rounded-none font-[500]'>
												Settings
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											asChild
											className='py-2 px-3 rounded-none font-[500]'
										>
											<Link href={`/client/listings`}>Switch to renting</Link>
										</DropdownMenuItem>
										<DropdownMenuItem className='py-2 px-3 rounded-none font-[500]'>
											Sign out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className='flex flex-nowrap items-center justify-end gap-4'>
									<Link
										href='/register'
										className={cn(
											buttonVariants({ variant: 'default' }),
											'rounded-full'
										)}
									>
										Sign up
									</Link>
									<Link
										href='/login'
										className={cn(
											buttonVariants({ variant: 'outline' }),
											'rounded-full'
										)}
									>
										Login
									</Link>
								</div>
							)}
						</div>
					</>
				) : (
					// mobile view
					<div className='flex flex-nowrap items-center justify-end'>
						<Sheet open={open} onOpenChange={setOpen} modal={false}>
							<SheetTrigger asChild>
								<Button variant='ghost' size='icon' className='[&_svg]:size-6'>
									{open ? <X /> : <Menu />}
								</Button>
							</SheetTrigger>
							<SheetContent
								className='h-[calc(100vh-80px)] mt-[calc(80px-12px)] py-0 bg-white'
								side='top'
							>
								<ScrollArea className='h-[calc(100vh-80px)]'>
									<SheetClose className='sr-only'>Close</SheetClose>
									<SheetHeader className='sr-only'>
										<SheetTitle>Navigation menu</SheetTitle>
										<SheetDescription>
											Mobile navigation menu.
										</SheetDescription>
									</SheetHeader>
									<div className='grid gap-11 py-7'>
										{/* menu */}
										<ul className='flex flex-col gap-2 [&_svg]:size-6'>
											<li className='mb-2'>MENU</li>
											<li>
												<Link
													href={`/test`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<Home /> Home
												</Link>
											</li>
											<li>
												<Link
													href={`/test`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<Scroll />
													Listings
												</Link>
											</li>
											<li>
												<Link
													href={`/test`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<MessageCircleMore />
													Messages
												</Link>
											</li>
											<li>
												<Link
													href={`/hosting/property`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<LibraryBig />
													Properties
												</Link>
											</li>
											<li>
												<Link
													href={`/test`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<Briefcase />
													Reservations
												</Link>
											</li>
											<li>
												<Link
													href={`/test`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<Lightbulb />
													Insigts
												</Link>
											</li>
										</ul>
										<Separator />
										{/* account */}
										<ul className='flex flex-col gap-2 [&_svg]:size-6'>
											<li className='mb-2'>ACCOUNT</li>
											<li>
												<Link
													href={`/test`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<UserCircle2 /> Profile
												</Link>
											</li>
											<li>
												<Link
													href={`/hosting/company`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<Building2 />
													Manage Companies
												</Link>
											</li>
											<li>
												<Link
													href={`/test`}
													className={cn(
														buttonVariants({ variant: 'ghost' }),
														'w-full justify-start rounded-none px-0 gap-2'
													)}
												>
													<Settings />
													Settings
												</Link>
											</li>
										</ul>
										<Separator />
										{/* sign out */}
										<div className='flex flex-col gap-2 [&_svg]:size-6'>
											<Button
											// onClick={async () => {
											//     SignOut();
											// }}
											>
												Sign out
											</Button>
										</div>
									</div>
								</ScrollArea>
							</SheetContent>
						</Sheet>
					</div>
				)}
			</div>
		</nav>
	);
}

export default TopNavigation;
