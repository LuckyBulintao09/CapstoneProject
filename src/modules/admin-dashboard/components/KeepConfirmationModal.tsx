import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';

interface KeepConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	handleKeep: () => void;
}

const KeepConfirmationModal = ({
	isOpen,
	onClose,
	handleKeep,
}: KeepConfirmationModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='bg-white dark:bg-secondary'>
				<DialogHeader>
					<DialogTitle>{spiels.MODAL_KEEP}</DialogTitle>
				</DialogHeader>
				<p>{spiels.MODAL_KEEP_HEADER}</p>
				<DialogFooter>
					<Button onClick={handleKeep}>{spiels.BUTTON_YES_KEEP}</Button>
					<Button onClick={onClose} variant='outline'>
						{spiels.BUTTON_CANCEL}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default KeepConfirmationModal;
