import TopNavigation from "@/modules/hosting/components/top-nav";

function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TopNavigation />
            {children}
        </div>
    );
}

export default LessorLayout;
