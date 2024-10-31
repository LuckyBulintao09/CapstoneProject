import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { BellIcon } from "@radix-ui/react-icons";
import {
  checkReservationConflict,
  fetchUser,
} from "@/actions/notification/notification";
import { ScrollArea } from "@/components/ui/scroll-area";

type Notification = {
  id: string;
  message: string;
  time: string;
};

type CustomPlacement =
  | "bottom"
  | "bottom-end"
  | "top"
  | "top-end"
  | "left"
  | "right";

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [placement, setPlacement] = useState<CustomPlacement>("bottom-end");

  useEffect(() => {
    const handleResize = () => {
      setPlacement(window.innerWidth >= 1024 ? "bottom" : "bottom-end");
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const checkConflicts = async () => {
      const userId = await fetchUser();
      if (!userId) return;

      const conflictMessages = await checkReservationConflict(userId);
      if (conflictMessages && conflictMessages.length > 0) {
        const uniqueNotifications: Notification[] = [];

        conflictMessages.forEach((conflictMessage) => {
          const notificationId = `${conflictMessage.message}-${conflictMessage.unitId}`;
          const exists = notifications.some(
            (notif) => notif.id === notificationId
          );

          if (!exists) {
            uniqueNotifications.push({
              id: notificationId,
              message: conflictMessage.message,
              time: new Date().toLocaleTimeString(),
            });
          }
        });

        if (uniqueNotifications.length > 0) {
          setNotifications((prev) => [
            ...prev,
            ...uniqueNotifications.filter(
              (newNotif) =>
                !prev.some((oldNotif) => oldNotif.id === newNotif.id)
            ),
          ]);
          setUnreadCount(uniqueNotifications.length);
        }
      }
    };

    checkConflicts();
    const interval = setInterval(checkConflicts, 60000);
    return () => clearInterval(interval);
  }, [notifications]);

  const handleOpenChange = (isOpen: boolean) => {
    setIsPopoverOpen(isOpen);
    if (isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <Popover
      placement={placement}
      offset={20}
      showArrow
      isOpen={isPopoverOpen}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger>
        <div className="cursor-pointer md:pr-2 mr-2 relative">
          <BellIcon width={20} height={20} className="dark:text-white" />
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white rounded-full px-1 absolute -top-1 -right-1">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg w-[300px] md:w-[400px] lg:w-[350px] max-w-full">
        <ScrollArea className="h-72 rounded-md ">
          <div className="p-4">
            <div className="mb-2 text-sm text-gray-500 font-semibold">
              Notifications
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No new notifications</div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
