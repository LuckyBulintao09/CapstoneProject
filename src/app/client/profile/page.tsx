import NavBar from "@/components/navbar/Navbar";
import Footer  from "@/modules/home/components/Footer";
import Profile_Hosting from "@/modules/profile/screens/Profile_Hosting";

export default async function profile() {
  return (
    <div className="h-screen overflow-auto">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="mt-16 sm:mt-16 md:mt-12 lg:mt-0 ">
        <Profile_Hosting />
      </div>
      <Footer />
    </div>
  );
}
