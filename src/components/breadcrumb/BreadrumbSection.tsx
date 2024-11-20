import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function BreadcrumbSection({
	propertyName,
}) {
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
					<BreadcrumbLink href='/client/listings'>Listings</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{propertyName}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
