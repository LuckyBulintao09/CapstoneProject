import NavBar from "@/components/navbar/Navbar";
import Pricing from "@/modules/subscriptions/screen/Pricing";
import Footer from "@/modules/home/components/Footer";

export default async function pricing() {
  return (
    <div className="h-screen overflow-auto">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="mt-16 sm:mt-16 md:mt-12 lg:mt-0 ">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
}
