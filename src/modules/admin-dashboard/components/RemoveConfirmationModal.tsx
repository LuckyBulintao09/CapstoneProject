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
	handleRemove: () => void;
}

const RemoveConfirmationModal = ({
	isOpen,
	onClose,
	handleRemove,
}: RejectConfirmationModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='bg-white dark:bg-secondary'>
				<DialogHeader>
					<DialogTitle>{spiels.MODAL_REMOVE}</DialogTitle>
				</DialogHeader>
				<p>{spiels.MODAL_REMOVE_HEADER}</p>
				<DialogFooter>
					<Button
						onClick={handleRemove}
						className='bg-destructive hover:bg-red-800'
					>
						{spiels.BUTTON_YES_REMOVE}
					</Button>
					<Button onClick={onClose} variant='outline'>
						{spiels.BUTTON_CANCEL}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RemoveConfirmationModal;
