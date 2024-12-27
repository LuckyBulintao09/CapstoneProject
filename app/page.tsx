import Hero from "@/components/landing-page/hero";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 sm:px-6 md:px-8 lg:px-16 items-center justify-center p-5">
        <Hero />
      </main>
    </>
  );
}
