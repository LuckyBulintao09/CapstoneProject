import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';

interface RejectConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	handleReject: () => void;
}

const RejectCompanyModal = ({
	isOpen,
	onClose,
	handleReject,
}: RejectConfirmationModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='bg-white dark:bg-secondary'>
				<DialogHeader>
					<DialogTitle>{spiels.MODAL_REJECT}</DialogTitle>
				</DialogHeader>
				<p>{spiels.MODAL_REJECT_COMPANY_HEADER}</p>
				<DialogFooter>
					<Button
						onClick={handleReject}
						className='bg-destructive hover:bg-red-800'
					>
						{spiels.BUTTON_YES_REJECT}
					</Button>
					<Button onClick={onClose} variant='outline'>
						{spiels.BUTTON_CANCEL}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RejectCompanyModal;
