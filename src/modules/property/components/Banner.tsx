import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';

function Banner() {
	return (
		<div className='col-span-8 mt-9'>
			<div className='flex flex-row justify-between bg-primary rounded-xl p-5'>
				<div className='flex flex-row items-center gap-3'>
					<Avatar className='h-16 w-auto'>
						<AvatarImage src='https://github.com/shadcn.png' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<p className='text-xl leading-7 [&:not(:first-child)]:mt-6 text-primary-foreground'>
							Lessor Name
						</p>
						<p className='text-sm text-primary-foreground'>
							Owner / Manager / Executive
						</p>
					</div>
				</div>
				<div className='flex flex-row items-center gap-3'>
					<div className='flex flex-row gap-3'>
						<Button
							variant='outline'
							className='border-white text-white hover:bg-white hover:text-black'
							onClick={() => {window.location.href = "/client/inbox"}}
						>
							<span className='flex flex-row items-center gap-1'>
								<MessageSquare className='w-5 h-5'/> {spiels.BUTTON_MESSAGE}
							</span>
						</Button>

						<Button
							variant='secondary'
							className='bg-white text-black border border-white hover:bg-secondary hover:border-secondary rounded-lg px-4 py-2 transition duration-200 ease-in-out'
							onClick={() => {window.location.href = "/property/company"}}
						>
							{spiels.BUTTON_VISIT_PROPERTY}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Banner;
