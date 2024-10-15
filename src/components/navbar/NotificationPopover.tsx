import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { BellIcon } from "@radix-ui/react-icons";

export function NotificationPopover() {
  const [placement, setPlacement] = useState("bottom-end");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setPlacement("bottom");
      } else {
        setPlacement("bottom-end");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Popover placement={placement} offset={20} showArrow>
      <PopoverTrigger>
        <div className="cursor-pointer md:pr-2">
          <BellIcon width={24} height={24} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg w-[300px] md:w-[400px] lg:w-[350px] max-w-full">
        <div className="p-3">
          {/* Notification Content */}
          <div className="mb-2 text-sm text-gray-500 font-semibold">Today</div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-md">
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-gray-800 text-sm">
                    Maintenance Request Update
                  </div>
                  <div className="text-xs text-gray-500">5h ago</div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  The maintenance request for{" "}
                  <span className="font-semibold">John Doe</span> in{" "}
                  <span className="font-semibold">Apartment 301</span> has been{" "}
                  <span className="text-green-600 font-semibold">
                    Completed
                  </span>
                  . The issue was resolved successfully.
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
