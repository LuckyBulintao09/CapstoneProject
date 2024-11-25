import { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { fetchNotifications } from '@/actions/notification/notification';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';

type Notification = {
	id: string;
	message: string;
	time: string;
};

type CustomPlacement =
	| 'bottom'
	| 'bottom-end'
	| 'top'
	| 'top-end'
	| 'left'
	| 'right';

export function NotificationPopover() {
	const supabase = createClient();

	const [notifications, setNotifications] = useState<any[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [placement, setPlacement] = useState<CustomPlacement>('bottom-end');
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setIsUserLoggedIn(!!session);
			setUser(session.user.id);
		});
	}, []);

	useEffect(() => {
		if (!isUserLoggedIn) return;

		const handleResize = () =>
			setPlacement(window.innerWidth >= 1024 ? 'bottom' : 'bottom-end');

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isUserLoggedIn]);

	useEffect(() => {
		if (!user) return;

		const fetchOldNotif = async () => {
			const data = await fetchNotifications(user);
			setNotifications(
				data.map((n) => ({
					...n,
					time: format(new Date(n.created_at), 'Pp'),
				}))
			);
			setUnreadCount(data.filter((n) => !n.statusRead).length);
		};
		fetchOldNotif();

		const { data: subscription } = supabase
			.channel('notifications')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'notifications',
					filter: `receiver_id=eq.${user}`,
				},
				(payload) => {
					setNotifications((prev) => [
						{
							...payload.new,
							time: format(new Date(payload.new.created_at), 'Pp'),
						},
						...prev,
					]);
					setUnreadCount((prev) => prev + 1);
				}
			)
			.subscribe();
		return () => subscription?.unsubscribe();
	}, [user]);

	const handleNotificationRead = async () => {
		const { error } = await supabase
			.from('notifications')
			.update({ statusRead: true })
			.eq('receiver_id', user);
		if (error) throw error;
	};

	if (!isUserLoggedIn) return null;

	return (
		<Popover
			placement={placement}
			offset={20}
			showArrow
			isOpen={isPopoverOpen}
			onOpenChange={(isOpen) => {
				setIsPopoverOpen(isOpen);
				if (isOpen) setUnreadCount(0);
				handleNotificationRead();
			}}
		>
			<PopoverTrigger>
				<div className='relative cursor-pointer'>
					<Bell width={18} height={18} className='dark:text-white' />
					{unreadCount > 0 && (
						<span className='absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1'>
							{unreadCount}
						</span>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent className='bg-white dark:bg-secondary border border-gray-200 rounded-lg shadow-lg w-[300px] md:w-[400px] lg:w-[350px] max-w-full'>
				<ScrollArea className='h-72 rounded-md'>
					<div className='p-4'>
						<div className='mb-2 text-sm font-semibold lg:pl-0 pl-4 text-foreground'>
							Notifications
						</div>
						{notifications?.length > 0 ? (
							<div className='space-y-1'>
								{notifications.map(({ id, text, time }) => (
									<div
										key={id}
										className='flex items-start gap-2 p-3 bg-gray-50 rounded-lg'
									>
										<div className='flex-1'>
											<div className='text-sm text-gray-800'>{text}</div>
											<div className='mt-1 text-xs text-gray-500'>{time}</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-sm w-[300px] pl-4 lg:pl-0 xs:text-gray-500 dark:text-gray-400'>
								No new notifications
							</div>
						)}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
