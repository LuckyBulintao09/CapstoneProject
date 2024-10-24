
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";


function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <section className="w-full">
                    {children}
                </section>
                <Toaster position="top-center" />
            </SidebarProvider>
        </div>
    );
}

export default LessorLayout;
