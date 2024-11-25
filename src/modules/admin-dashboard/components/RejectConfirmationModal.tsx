import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@nextui-org/react";
import { useState } from "react";
import spiels from "@/lib/constants/spiels";

interface RejectConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleReject: (reason: string) => void;
}

const RejectConfirmationModal = ({
  isOpen,
  onClose,
  handleReject,
}: RejectConfirmationModalProps) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReasonSubmit = () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    handleReject(rejectionReason.trim());
    setRejectionReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-secondary">
        <DialogHeader>
          <DialogTitle>{spiels.MODAL_REJECT}</DialogTitle>
        </DialogHeader>
        <p>{spiels.MODAL_REJECTION_HEADER}</p>
        <div className="mt-4">
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection"
            classNames={{
              base: "max-w-full",
              input: "resize-y min-h-[80px]",
            }}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleReasonSubmit}
            className="bg-destructive hover:bg-red-800"
          >
            {spiels.BUTTON_YES_REJECT}
          </Button>
          <Button onClick={onClose} variant="outline">
            {spiels.BUTTON_CANCEL}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectConfirmationModal;
