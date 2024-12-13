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
import { useState } from 'react';

interface ApproveConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	handleApprove: () => void;
	confirmationMessage: string;
}

const ApproveBooking = ({
	isOpen,
	onClose,
	handleApprove,
	confirmationMessage,
}: ApproveConfirmationModalProps) => {
	const [disabled, setDisabled] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='bg-white dark:bg-secondary top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
				<DialogHeader>
					<DialogTitle>{spiels.MODAL_APPROVE}</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<p className='text-md'>{confirmationMessage}</p>
				</DialogDescription>
				<DialogFooter>
					<Button 
					 disabled={disabled}
					onClick={() => {
						handleApprove();
						setDisabled(true);
						onClose();
					}}>{spiels.BUTTON_YES_APPROVE}</Button>
					<Button onClick={onClose} variant='outline'>
						{spiels.BUTTON_CANCEL}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ApproveBooking;
