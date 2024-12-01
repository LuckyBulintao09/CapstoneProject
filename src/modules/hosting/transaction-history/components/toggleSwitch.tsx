import { useState } from "react";
import { CheckIcon, XMarkIcon, HomeIcon } from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import RejectionTransactionModal from "./cancellationModal";

interface ToggleSwitchProps {
  transactionId: number;
  unitId: number;
  onStatusChange: (
    id: number,
    newStatus: string,
    unitId: number,
    reason?: string
  ) => Promise<void>;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  transactionId,
  unitId,
  onStatusChange,
}) => {
  const [dragPosition, setDragPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const slider = e.currentTarget.getBoundingClientRect();
    const newPosition = Math.min(
      100,
      Math.max(0, ((e.clientX - slider.left) / slider.width) * 100)
    );
    setDragPosition(newPosition);
  };

  const handleMouseRelease = async () => {
    setIsDragging(false);
    if (dragPosition < 25) {
      setShowActionButtons(true);
    } else if (dragPosition > 75) {
      setIsModalOpen(true);
    }
    setDragPosition(50);
  };

  const handleCancel = async () => {
    if (!reason) return;
    await onStatusChange(transactionId, "cancelled", unitId, reason);
    setIsModalOpen(false);
    setReason("");
  };

  return (
    <>
      {!showActionButtons ? (
        <div
          className="relative flex items-center justify-between w-36 p-2 bg-gray-100 dark:bg-gray-900 rounded-full cursor-pointer"
          onMouseMove={handleDrag}
          onMouseUp={handleMouseRelease}
          onMouseLeave={() => isDragging && handleMouseRelease()}
        >
          <div className="flex items-center justify-center w-8 h-8 text-green-500">
            <CheckIcon className="w-5 h-5" />
          </div>
          <div
            className="absolute z-10 flex items-center justify-center w-10 h-10 bg-black rounded-full text-white transition-transform duration-300 ease-out"
            style={{ left: `${dragPosition}%`, transform: "translateX(-50%)" }}
            onMouseDown={() => setIsDragging(true)}
          >
            <HomeIcon className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-center w-8 h-8 text-red-500">
            <XMarkIcon className="w-5 h-5" />
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Button
            className="bg-blue-700 text-white"
            onClick={async () => {
              await onStatusChange(transactionId, "reserved", unitId);
              setShowActionButtons(false);
            }}
          >
            Reserved
          </Button>
          <Button
            className="bg-green-700 text-white"
            onClick={async () => {
              await onStatusChange(transactionId, "visited", unitId);
              setShowActionButtons(false);
            }}
          >
            Visited
          </Button>
        </div>
      )}

      {isModalOpen && (
        <RejectionTransactionModal
          unitId={unitId}
          onStatusChange={onStatusChange}
          setIsModalOpen={setIsModalOpen}
          handleCancel={handleCancel}
          setReason={setReason}
          reason={reason}
        />
      )}
    </>
  );
};

export default ToggleSwitch;

