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
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const userId = await fetchUser();
      setIsUserLoggedIn(!!userId);
    })();
  }, []);

  useEffect(() => {
    if (!isUserLoggedIn) return;

    const handleResize = () =>
      setPlacement(window.innerWidth >= 1024 ? "bottom" : "bottom-end");

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (!isUserLoggedIn) return;

    const fetchNotifications = async () => {
      const userId = await fetchUser();
      if (!userId) return;

      const conflicts = await checkReservationConflict(userId);
      const newNotifications = conflicts
        .filter(({ message, unitId }) =>
          notifications.every((notif) => notif.id !== `${message}-${unitId}`)
        )
        .map((conflict) => ({
          id: `${conflict.message}-${conflict.unitId}`,
          message: conflict.message,
          time: new Date().toLocaleTimeString(),
        }));

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifications]);
        setUnreadCount(newNotifications.length);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [notifications, isUserLoggedIn]);

  if (!isUserLoggedIn) return null;

  return (
    <Popover
      placement={placement}
      offset={20}
      showArrow
      isOpen={isPopoverOpen}
      onOpenChange={(isOpen) => {
        setIsPopoverOpen(isOpen);
        if (isOpen) setUnreadCount(0);
      }}
    >
      <PopoverTrigger>
        <div className="relative cursor-pointer md:pr-2 mr-2">
          <BellIcon width={20} height={20} className="dark:text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg w-[300px] md:w-[400px] lg:w-[350px] max-w-full">
        <ScrollArea className="h-72 rounded-md">
          <div className="p-4">
            <div className="mb-2 text-sm font-semibold text-gray-500">
              Notifications
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map(({ id, message, time }) => (
                  <div
                    key={id}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">{message}</div>
                      <div className="mt-1 text-xs text-gray-500">{time}</div>
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
