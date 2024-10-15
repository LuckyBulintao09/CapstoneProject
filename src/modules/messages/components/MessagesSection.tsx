'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import tempValues from './../../../lib/constants/tempValues';
import { ProfileAlertDetails } from '@/components/profile-alert';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import spiels from '@/lib/constants/spiels';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// for avatar fallback
const getInitials = (name: string) => {
	const names = name.split(' ');
	if (names.length === 0) return 'NN'; // default
	const firstInitial = names[0].charAt(0).toUpperCase();
	const lastInitial =
		names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
	return `${firstInitial}${lastInitial}`;
};

function highlightText(text: string, term: string) {
	if (!term.trim()) return text;

	const regex = new RegExp(
		`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`,
		'gi'
	);
	return text.replace(
		regex,
		'<span class="bg-secondary text-primary dark:bg-accent-foreground dark:text-black">$1</span>'
	);
}

interface Message {
	id: number;
	name: string;
	message: string;
	dorm_name: string;
	email: string;
	contact: string;
	read: boolean;
	imageSrc?: string;
}

export default function MessagesSection() {
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
	const [messages, setMessages] = useState<Message[]>(tempValues.LESSORS);
	const [searchTerm, setSearchTerm] = useState('');
	const [userMessage, setUserMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<string[]>([]);

	// tab for all | unread
	const [tab, setTab] = useState('all');

	// for selecting message
	const handleSelectMessage = (message: Message) => {
		setSelectedMessage(message);
		setChatMessages([message.message]); // resets chat

		// marks message as read
		setMessages((prevMessages) =>
			prevMessages.map((msg) =>
				msg.id === message.id ? { ...msg, read: true } : msg
			)
		);
	};

	// for sending message
	const handleSendMessage = () => {
		if (userMessage.trim()) {
			setChatMessages((prev) => [...prev, `You: ${userMessage}`]);
			setUserMessage('');
		}
	};

	// for filtering messages based on tab selection
	const filteredMessages = messages
		.filter((message) =>
			[message.name, message.message, message.dorm_name].some((field) =>
				field.toLowerCase().includes(searchTerm.toLowerCase())
			)
		)
		.filter((message) => (tab === 'unread' ? !message.read : true)); // shows unread tab if 'unread' tab is active

	return (
		<div className='p-5  h-screen'>
			<Card className='h-full m-2 lg:m-2 md:m-2 bg-white dark:bg-secondary'>
				<ResizablePanelGroup direction='horizontal' className='h-full'>
					{/* 1ST COL: Message List with scroll */}
					<ResizablePanel
						defaultSize={0}
						className='min-w-[0px] max-w-[400px] w-0 lg:w-full lg:min-w-[340px]'
					>
						<div className='flex flex-col h-full'>
							<div className='flex items-center justify-between px-4 sm:px-6 pt-2'>
								<h2 className='font-bold text-lg lg:text-xl'>
									{spiels.MESSAGES_HEADER} ({filteredMessages.length})
								</h2>

								{/* tabs for all | unread */}
								<div className='flex items-right justify-end'>
									<Tabs
										defaultValue='all'
										className='py-3'
										onValueChange={(value) => setTab(value)}
									>
										<TabsList className='grid w-full grid-cols-2 bg-gray-200 dark:bg-input'>
											<TabsTrigger value='all'>{spiels.TAB_ALL}</TabsTrigger>
											<TabsTrigger value='unread'>
												{spiels.TAB_UNREAD}
											</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>
							</div>

							{/* search input */}
							<div className='px-4 sm:px-6 pb-2'>
								<div className='relative'>
									<Input
										placeholder='Search messages...'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className='pl-10'
									/>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<Search className='h-5 w-5 text-gray-400' />
									</div>
								</div>
							</div>

							{/* list */}
							<ScrollArea className='flex-1'>
								<div className='p-4 sm:p-6'>
									{filteredMessages.length ? (
										filteredMessages.map((message) => (
											<div key={message.id}>
												<div
													onClick={() => handleSelectMessage(message)}
													className={`p-2 lg:p-3 cursor-pointer rounded-md border ${
														selectedMessage?.id === message.id
															? 'border-primary'
															: 'border-gray-300'
													} flex justify-between items-center`}
												>
													<div className='flex items-center'>
														<Avatar className='mr-3 lg:mr-4'>
															<AvatarFallback>
																{getInitials(message.name)}
															</AvatarFallback>
														</Avatar>
														<div className='flex flex-col'>
															<h3 className='font-bold text-sm lg:text-base'>
																{message.name}
															</h3>

															<p
																className={`text-xs lg:text-sm line-clamp-1 ${
																	!message.read
																		? 'font-bold text-gray-900 dark:text-white'
																		: 'text-gray-500'
																}`}
																dangerouslySetInnerHTML={{
																	__html: highlightText(
																		message.message,
																		searchTerm
																	),
																}}
															></p>
														</div>
													</div>

													{/* indicator for unread messages */}
													{!message.read && (
														<div className='h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-primary flex-shrink-0'></div>
													)}
												</div>
												<Separator className='my-2' />
											</div>
										))
									) : (
										<p className='text-center mt-4 text-gray-500'>
											{spiels.MESSAGES_NO_RESULT}
										</p>
									)}
								</div>
							</ScrollArea>
						</div>
					</ResizablePanel>

					<ResizableHandle withHandle />

					{/* 2ND COL: Chat exchange */}
					<ResizablePanel defaultSize={75}>
						<div className='flex flex-col h-full'>
							{/* Chat header */}
							{selectedMessage ? (
								<>
									<div className='flex items-center p-4 border-b'>
										<Avatar className='mr-3 lg:mr-4'>
											{selectedMessage.imageSrc ? (
												<AvatarImage
													src={selectedMessage.imageSrc}
													alt={selectedMessage.name}
												/>
											) : (
												<AvatarFallback>
													{getInitials(selectedMessage.name)}
												</AvatarFallback>
											)}
										</Avatar>
										<div className='flex flex-col'>
											<h2 className='font-bold text-lg'>
												{selectedMessage.name}
											</h2>
											<Badge className='mt-0'>
												{selectedMessage.dorm_name}
											</Badge>
										</div>
										<div className='ml-auto'>
											<ProfileAlertDetails
												name={selectedMessage}
												buttonLabel='Show Details'
												buttonAction='Close'
											/>
										</div>
									</div>

									{/* chat body */}
									<ScrollArea className='flex-1 p-4'>
										<div className='space-y-2'>
											{chatMessages.map((msg, index) => (
												<div
													key={index}
													className={`flex items-start ${
														msg.startsWith('You:')
															? 'flex-row-reverse'
															: 'flex-row'
													}`}
												>
													<Avatar
														className={`w-6 h-6 lg:w-8 lg:h-8 text-xs ${
															msg.startsWith('You:') ? 'ml-2' : 'mr-2'
														}`}
													>
														<AvatarFallback>
															{msg.startsWith('You:')
																? getInitials('Your Name')
																: getInitials(selectedMessage.name)}
														</AvatarFallback>
													</Avatar>
													<div
														className={`p-2 rounded-lg max-w-auto ${
															msg.startsWith('You:')
																? 'bg-blue-100 text-right ml-2 dark:bg-muted dark:text-input'
																: 'bg-gray-100 mr-2 dark:bg-accent dark:text-background'
														}`}
													>
														{msg}
													</div>
												</div>
											))}
										</div>
									</ScrollArea>

									{/* chat input */}
									<div className='p-4 border-t'>
										<div className='flex flex-col sm:flex-row gap-2'>
											<Input
												value={userMessage}
												onChange={(e) => setUserMessage(e.target.value)}
												placeholder='Type a message...'
											/>
											<Button onClick={handleSendMessage} className=''>
												{spiels.BUTTON_SEND}
											</Button>
										</div>
									</div>
								</>
							) : (
								// default 2nd col
								<div className='flex items-center justify-center h-full'>
									<p className='text-gray-500'>
										{spiels.MESSAGES_NO_CHATS_SELECTED}
									</p>
								</div>
							)}
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</Card>
		</div>
	);
}
