import NavBar from "@/components/navbar/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <><NavBar />
    <div>{children}</div></>
  );
}
