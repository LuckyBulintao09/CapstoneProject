'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import spiels from '@/lib/constants/spiels';

export function NavbarMenu({ session }: { session: any }) {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				{spiels.NAVBAR_MENU_LIST_WITH_DROPDOWN.map((item, index) => (
					<NavigationMenuItem key={index}>
						<NavigationMenuTrigger>
							<Link href={item.href} legacyBehavior passHref>
								{item.label}
							</Link>
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px]'>
								{spiels.NAVBAR_HOME_MENUCONTENT.map((component) => (
									<ListItem
										key={component.label}
										title={component.label}
										href={`#${component.href.split('/').pop()}`}
									>
										{component.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				))}

				{spiels.NAVBAR_MENU_LIST_WITHOUT_DROPDOWN.map((item, index) => {
					if (
						(!session && item.label === 'Messages') ||
						(!session && item.label === 'Favorites')
					)
						return null;
					return (
						<NavigationMenuItem
							key={index}
							className='dark:text-secondary-foreground'
						>
							<Link href={item.href} legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									{item.label}
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-card hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...props}
				>
					<div className='text-sm font-medium leading-none'>{title}</div>
					<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = 'ListItem';
