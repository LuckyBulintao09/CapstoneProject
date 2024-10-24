import NavBar from "@/components/navbar/Navbar";
import Footer from "@/modules/home/components/Footer";

function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <NavBar />
            <div>{children}</div>
            <Footer />
        </section>
    );
}
export default ChatLayout;
