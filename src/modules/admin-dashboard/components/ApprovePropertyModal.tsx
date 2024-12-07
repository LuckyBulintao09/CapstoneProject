import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming an Input component exists
import spiels from '@/lib/constants/spiels';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ApprovePropertyModalProps {
	isOpen: boolean;
	onClose: () => void;
	handleApprove: () => void;
	property_title: string;
}

const ApprovePropertyModal = ({
	isOpen,
	onClose,
	handleApprove,
	property_title,
}: ApprovePropertyModalProps) => {
	const [confirmationInput, setConfirmationInput] = useState('');

	const handleApproveClick = () => {
		if (confirmationInput.trim() !== property_title) {
			toast.error('Property name does not match.');
			return;
		}
		handleApprove();
		setConfirmationInput('');
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='bg-white dark:bg-secondary'>
				<DialogHeader>
					<DialogTitle>{spiels.MODAL_APPROVE}</DialogTitle>
				</DialogHeader>
				<p className='mt-2'>{spiels.MODAL_APPROVE_COMPANY_HEADER}</p>
				<div className='mt-4'>
					<Input
						placeholder={`Type "${property_title}" to confirm`}
						value={confirmationInput}
						onChange={(e) => setConfirmationInput(e.target.value)}
						className='rounded-lg'
					/>
				</div>
				<DialogFooter className='mt-4'>
					<Button onClick={handleApproveClick} variant='default'>
						{spiels.BUTTON_YES_APPROVE}
					</Button>
					<Button onClick={onClose} variant='outline'>
						{spiels.BUTTON_CANCEL}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ApprovePropertyModal;
