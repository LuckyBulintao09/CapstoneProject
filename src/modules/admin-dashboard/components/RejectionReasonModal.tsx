"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";

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
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReasonSubmit = () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    onSubmit(rejectionReason.trim());
    setRejectionReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Enter Rejection Reason
            </ModalHeader>
            <ModalBody>
              <Textarea
                label="Rejection Reason"
                variant="bordered"
                placeholder="Enter reason for rejection"
                disableAnimation
                disableAutosize
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                classNames={{
                  base: "max-w-full",
                  input: "resize-y min-h-[80px]",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseModal}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleReasonSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RejectionReasonModal;
