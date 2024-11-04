
import { ModeToggle } from "@/components/mode-toggle";

function HostingContentLayout({children, title}: {children: React.ReactNode, title: string}) {
  return (
      <div>
          <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
              <div className="mx-3 flex h-14 items-center">
                  <div className="flex items-center gap-3 lg:space-x-0">
                      {/* <SidebarTrigger className="-ml-1" /> */}
                      <h1 className="font-bold">{title}</h1>
                  </div>
                  <div className="flex flex-1 items-center justify-end gap-3">
                      <ModeToggle />
                  </div>
              </div>
          </header>
          {children}
      </div>
  );
}

export default HostingContentLayout