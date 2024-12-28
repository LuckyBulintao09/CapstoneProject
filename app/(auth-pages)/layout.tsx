import NavBar from "@/components/navbar/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <><NavBar />
    <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div></>
  );
}
