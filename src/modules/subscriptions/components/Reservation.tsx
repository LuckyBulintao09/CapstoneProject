const Reservation = () => {
  return (
    <section className="h-full mt-32">
      <div className="flex flex-col mx-5 text-center ">
        <div className="flex justify-center">
          <div className="text-4xl font-extrabold w-[80%]">
            <h1 className="">Reservation Fee: Only 3%</h1>
          </div>
        </div>
        <hr className="my-6 border-gray-300 md:hidden" />
        <div className=" md:mt-8 px-6 ">
          <p className="text-lg">
            When a guest books your property through our platform, we charge a
            3% reservation fee. This fee is applied only to confirmed
            reservations, ensuring that you keep more of your hard-earned money.
          </p>
        </div>
      </div>
    </section>
  );
};
export default Reservation;
