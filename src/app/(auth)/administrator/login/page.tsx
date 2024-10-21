import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import ALogin from "@/modules/admin_login/components/adminLogin";
const AdminLogin = () => {
  return (
    <>
      <section
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/2.png')" }}
      >
        <ALogin />
      </section>
    </>
  );
};

export default AdminLogin;
