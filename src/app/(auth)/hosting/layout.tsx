import TopNavigation from "@/modules/hosting/components/top-nav";
import { Toaster } from "sonner";

function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TopNavigation />
            <section className="w-full">{children}</section>
            <Toaster position="top-center" />
        </div>
    );
}

export default LessorLayout;
