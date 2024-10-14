import NavBar from "@/components/navbar/Navbar";
import { Footer } from "@/modules/lessor-dashboard/components/Footer";
import Terms_Conditions from "@/modules/terms_and_conditions/screen/Terms_Conditions";

export default async function inbox() {
  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="mt-16 sm:mt-16 md:mt-12 lg:mt-0 ">
        <Terms_Conditions />
      </div>
      <Footer />
    </div>
  );
}
