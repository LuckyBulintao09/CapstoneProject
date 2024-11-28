
import { ModeToggle } from "@/components/mode-toggle";

function HostingContentLayout({children}: {children: React.ReactNode}) {
  return (
      <div className="px-32">
          <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                  {children}
              </div>
          </div>
      </div>
  );
}

export default HostingContentLayout