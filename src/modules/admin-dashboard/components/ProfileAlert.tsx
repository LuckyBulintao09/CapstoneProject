import { useState } from 'react';
import { NewLessors } from './types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';

interface ProfileAlertProps {
	lessor: NewLessors;
	isOpen: boolean;
	onClose: () => void;
}

export function ProfileAlert({ lessor, isOpen, onClose }: ProfileAlertProps) {
	const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

	const handleApprove = () => {
		setIsApproveModalOpen(false);
		onClose();
	};

	const handleReject = () => {
		setIsRejectModalOpen(false);
		onClose();
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className='bg-white dark:bg-secondary'>
					<DialogHeader>
						<DialogTitle>{spiels.ADMIN_MODAL_HEADER}</DialogTitle>
						<DialogDescription>
							<div className='grid gap-4 py-4'>
								<div className='grid w-full max-w-auto items-center gap-1.5'>
									<Label htmlFor='name'>{spiels.FORM_NAME}</Label>
									<Input
										type='text'
										id='name'
										placeholder={lessor.name}
										disabled
									/>
								</div>
								<div className='grid w-full max-w-auto items-center gap-1.5'>
									<Label htmlFor='email'>{spiels.FORM_EMAIL}</Label>
									<Input
										type='email'
										id='email'
										placeholder={lessor.email}
										disabled
									/>
								</div>
								<div className='grid w-full max-w-auto items-center gap-1.5'>
									<Label htmlFor='number'>{spiels.FORM_CONTACT_NUMBER}</Label>
									<Input
										type='text'
										id='number'
										placeholder={lessor.contact}
										disabled
									/>
								</div>
								<div className='grid w-full max-w-auto items-center gap-1.5'>
									<Label htmlFor='address'>{spiels.FORM_ADDRESS}</Label>
									<Input
										type='text'
										id='address'
										placeholder={lessor.address}
										disabled
									/>
								</div>
								<div className='grid w-full max-w-auto items-center gap-1.5'>
									<Label htmlFor='date'>{spiels.FORM_BIRTHDATE}</Label>
									<Input
										type='date'
										id='date'
										value={lessor.birthdate}
										disabled
									/>
								</div>
								<div className='grid w-full max-w-auto items-center gap-1.5'>
									<Label>{spiels.FORM_GOVERNMENT_ID}</Label>
									<a
										href={lessor.govIdUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-600 dark:text-primary underline'
									>
										{spiels.FORM_VIEW_GOVERNMENT_ID}
									</a>
								</div>
								<div className='grid w-full max-w-auto items-center gap-1.5'>
									<Label>{spiels.FORM_BUSINESS_LICENSE}</Label>
									<a
										href={lessor.businessLicenseUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-600 dark:text-primary underline'
									>
										{spiels.FORM_VIEW_BUSINESS_LICENSE}
									</a>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setIsApproveModalOpen(true)}>
							{spiels.BUTTON_APPROVE}
						</Button>
						<Button
							onClick={() => setIsRejectModalOpen(true)}
							variant='outline'
						>
							{spiels.BUTTON_REJECT}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Approve Confirmation Modal */}
			<Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
				<DialogContent className='bg-white dark:bg-secondary'>
					<DialogHeader>
						<DialogTitle>{spiels.MODAL_APPROVE}</DialogTitle>
					</DialogHeader>
					<DialogDescription>{spiels.MODAL_APPROVE_HEADER}</DialogDescription>
					<DialogFooter>
						<Button onClick={handleApprove}>{spiels.BUTTON_YES_APPROVE}</Button>
						<Button
							onClick={() => setIsApproveModalOpen(false)}
							variant='outline'
						>
							{spiels.BUTTON_CANCEL}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Reject Confirmation Modal */}
			<Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
				<DialogContent className='bg-white dark:bg-secondary'>
					<DialogHeader>
						<DialogTitle>{spiels.MODAL_REJECT}</DialogTitle>
					</DialogHeader>
					<DialogDescription>{spiels.MODAL_REJECTION_HEADER}</DialogDescription>
					<DialogFooter>
						<Button onClick={handleReject} className='bg-destructive'>
							{spiels.BUTTON_YES_REJECT}
						</Button>
						<Button
							onClick={() => setIsRejectModalOpen(false)}
							variant='outline'
						>
							{spiels.BUTTON_CANCEL}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
