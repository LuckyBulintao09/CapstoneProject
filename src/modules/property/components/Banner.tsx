import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';
import { initializeSendMessage } from '@/actions/chat/initiateConversation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const suggestedMessages = [
	'Is this available?',
	'Can you provide more details?',
	'Is the property pet-friendly?',
	'What is the security deposit amount?',
	'How soon is the property available for move-in?',
	'Are there any discounts for long-term leases?',
	'What is the minimum rental period?',
	'How do you handle extra persons?',
];

interface BannerProps {
	ownerName: string | undefined;
	ownerLastname: string | undefined;
	ownerId: string | undefined;
	companyId: string | undefined;
	companyName: string | undefined;
	propertyId: number | undefined;
	profileUrl: string | undefined;
	session: string | undefined;
}

const Banner: React.FC<BannerProps> = ({
	ownerName,
	ownerLastname,
	ownerId,
	companyId,
	companyName,
	propertyId,
	profileUrl,
	session,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const suggestionsRef = useRef<HTMLDivElement>(null);

	const handleSendMessage = async () => {
		if (!session) {
			toast.error('You need to be logged in to send a message');
			return;
		}
		if (!ownerId || !propertyId) return;

		if (!inputValue.trim()) {
			toast.error('Message cannot be empty');
			return;
		}

		setIsLoading(true);
		try {
			const conversationUrl = await initializeSendMessage(
				ownerId,
				propertyId,
				ownerName,
				ownerLastname,
				inputValue
			);
			if (conversationUrl) {
				window.open(conversationUrl, '_blank');
			}
			setInputValue('');
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuggestionClick = (message: string) => {
		setInputValue(message);
		setIsFocused(false);
	};

	return (
		<div className='col-span-8 mt-9 mb-6 pb-6'>
			<div className='flex flex-col md:flex-row justify-between bg-primary rounded-xl p-5'>
				<div className='flex flex-row items-center gap-3 mb-4 md:mb-0'>
					<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
						<AvatarImage
							src={profileUrl}
							className='object-cover w-full h-full'
						/>
						<AvatarFallback className='flex items-center justify-center w-full h-full'>
							{ownerName?.charAt(0)}
							{ownerLastname?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<p className='text-md text-primary-foreground font-bold'>
							Hosted by {ownerName}
						</p>

						<small className='text-xs md:text-sm text-slate-200'>
							Company Manager
						</small>
					</div>
				</div>
				<div className='flex flex-col md:flex-row items-center gap-3'>
					<div className='flex flex-col md:flex-row gap-3 items-stretch w-full md:w-auto'>
						<div className='relative flex flex-row gap-1 outline outline-1 outline-white rounded-lg px-1 py-1'>
							<Input
								value={inputValue}
								required
								onFocus={() => setIsFocused(true)}
								onBlur={() => setTimeout(() => setIsFocused(false), 150)}
								onChange={(e) => setInputValue(e.target.value)}
								type='text'
								className='bg-white text-black hover:bg-neutral-100 dark:hover:bg-popover-foreground rounded-lg px-4 py-2 transition duration-200 ease-in-out w-full'
								placeholder='Type your message...'
							/>
							{isFocused && (
								<div
									ref={suggestionsRef}
									className='absolute top-full left-0 w-full mt-2 bg-white shadow-lg rounded-lg'
								>
									<ul className='text-sm text-gray-700'>
										{suggestedMessages.map((message, index) => (
											<li
												key={index}
												className='px-4 py-2 cursor-pointer hover:bg-gray-100'
												onClick={() => handleSuggestionClick(message)}
											>
												{message}
											</li>
										))}
									</ul>
								</div>
							)}
							<Button
								variant='outline'
								className='border-white text-white hover:bg-foreground hover:text-neutral-300 hover:border-neutral-300'
								onClick={handleSendMessage}
								disabled={isLoading}
								aria-label='Message the owner'
							>
								<span className='flex flex-row items-center gap-1'>
									{isLoading ? 'Sending...' : spiels.BUTTON_MESSAGE}
								</span>
							</Button>
						</div>
						<Button
							variant='secondary'
							className='bg-white text-black hover:bg-neutral-100 dark:hover:bg-popover-foreground rounded-lg px-4 py-2 transition duration-200 ease-in-out w-full md:w-auto'
							onClick={() => {
								window.location.href = `/property/company/${companyId}`;
							}}
						>
							{spiels.BUTTON_VISIT_COMPANY}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Banner;
