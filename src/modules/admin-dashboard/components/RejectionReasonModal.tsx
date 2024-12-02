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
import spiels from '@/lib/constants/spiels';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface RejectionReasonModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reason: string) => void;
}

const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
}) => {
	const [rejectionReason, setRejectionReason] = useState('');

	const handleReasonSubmit = () => {
		if (!rejectionReason.trim()) {
			toast.error('Please enter a rejection reason.');
			return;
		}
		onSubmit(rejectionReason.trim());
		setRejectionReason('');
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
					</div>
				</DialogDescription>

				<DialogFooter>
					<Button
						className='bg-red-800 hover:bg-red-800'
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
