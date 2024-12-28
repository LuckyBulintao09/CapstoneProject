import NavBar from "@/components/navbar/Navbar"


function UnprotectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
        <NavBar />
      <div> 
        {children}
      </div>
    </section>
  );
}

export default UnprotectedLayout
