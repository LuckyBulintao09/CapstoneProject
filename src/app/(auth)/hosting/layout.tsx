
import { AppSidebar } from "@/modules/hosting/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";


function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <section className="w-full">
                    {children}
                </section>
            </SidebarProvider>
        </div>
    );
}

export default LessorLayout;
