import TopNavigation from "@/modules/hosting/components/top-nav";
import { Toaster } from "sonner";

function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TopNavigation />
            {children}
        </div>
    );
}

export default LessorLayout;
