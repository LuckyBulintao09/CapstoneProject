const Landing = () => {
  return (
    <section className="h-full ">
      <div className="flex flex-col mx-5 text-center ">
        <div className="flex justify-center">
          <div className="text-4xl font-extrabold w-[90%]">
            <h1 className="">
              Pricing Plans for Our Condominium Reservation Platform
            </h1>
          </div>
        </div>
        <hr className="my-6 border-gray-300 md:hidden" />
        <div className="md:mt-8 px-6 ">
          <p className="text-lg">
            Welcome to our Condominium Reservation Platform! We offer a simple
            and effective way to manage your property listings and reservations.
            Below are our pricing options designed to help you maximize your
            exposure and streamline your booking process.
          </p>
        </div>
      </div>
    </section>
  );
};
export default Landing;
