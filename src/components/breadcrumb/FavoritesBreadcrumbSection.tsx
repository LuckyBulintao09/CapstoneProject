import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function FavoritesBreadcrumbSection() {
	return (
		<Breadcrumb className='pt-6'>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href='/'>Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{/* <BreadcrumbItem>
					<DropdownMenu>
						<DropdownMenuTrigger className='flex items-center gap-1'>
							<BreadcrumbEllipsis className='h-4 w-4' />
							<span className='sr-only'>Toggle menu</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start'>
							<DropdownMenuItem>Documentation</DropdownMenuItem>
							<DropdownMenuItem>Themes</DropdownMenuItem>
							<DropdownMenuItem>GitHub</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</BreadcrumbItem>
				<BreadcrumbSeparator /> */}
				<BreadcrumbItem>
					<BreadcrumbLink
						href='/client/favorites'
						className='text-primary dark:text-blue-300 font-semibold'
					>
						Favorites
					</BreadcrumbLink>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
