'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import spiels from '@/lib/constants/spiels';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RejectionReasonModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reason: string) => void;
	property_title: string;
}

const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	property_title,
}) => {
	const [rejectionReason, setRejectionReason] = useState('');
	const [confirmationInput, setConfirmationInput] = useState('');

	const handleReasonSubmit = () => {
		if (!rejectionReason.trim()) {
			toast.error('Please enter a rejection reason.');
			return;
		}
		if (confirmationInput.trim() !== property_title) {
			toast.error('Company name does not match.');
			return;
		}
		onSubmit(rejectionReason.trim());
		setRejectionReason('');
		setConfirmationInput('');
		onClose(); // Close modal after submitting
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='rounded-lg'>
				<DialogHeader>
					<DialogTitle>{spiels.MODAL_REJECT}</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<div>
						<p className='flex justify-center text-center items-center text-md'>
							{spiels.MODAL_REJECT_PROPERTY_HEADER}
						</p>
						<div className='mt-4'>
							<Textarea
								placeholder='Enter reason for rejection'
								value={rejectionReason}
								onChange={(e) => setRejectionReason(e.target.value)}
								className='resize-y max-h-[200px] rounded-lg'
							/>
						</div>
						<div className='mt-4'>
							<Input
								placeholder={`Type "${property_title}" to confirm`}
								value={confirmationInput}
								onChange={(e) => setConfirmationInput(e.target.value)}
								className='rounded-lg'
							/>
						</div>
					</div>
				</DialogDescription>

				<DialogFooter>
					<Button
						variant='default'
						onClick={handleReasonSubmit}
					>
						Reject
					</Button>
					<Button variant='outline' onClick={onClose}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RejectionReasonModal;
