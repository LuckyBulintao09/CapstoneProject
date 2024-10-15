import Landing from "../components/Landing";
import Just100 from "../components/Just100";
import Boost1 from "../components/Boost1";
import Boost2 from "../components/Boost2";
import Reservation from "../components/Reservation";
import WhyChoose1 from "../components/WhyChoose1";
import WhyChoose2 from "../components/WhyChoose2";
import HowItWorks1 from "../components/HowItWorks1";
import HowItWorks2 from "../components/HowItWorks2";
import GetStarted from "../components/GetStarted";
const Pricing = () => {
  return (
    <section className="pt-[10%] lg:pt-[5%] xl:mx-[15%]">
      <Landing />
      <Just100 />
      <div className="flex flex-col md:flex-row flex-col-reverse  mt-32 mx-6">
        <div className="md:w-[55%] ">
          <Boost1 />
        </div>

        <div className="md:w-[45%] md:ml-10 md:mt-6 mb-10">
          <Boost2 />
        </div>
      </div>
      <Reservation />
      <div className="flex flex-col md:flex-row-reverse flex-col-reverse mt-32 mx-6">
        <div className=" md:w-[55%]">
          <WhyChoose1 />
        </div>
        <div className="md:w-[45%] md:mr-10 md:mt-6 mb-10">
          <WhyChoose2 />
        </div>
      </div>
      <div className="flex flex-col flex-col-reverse mt-32 mx-6 ">
        <div className=" ">
          <HowItWorks1 />
        </div>
        <div className="mb-10">
          <HowItWorks2 />
        </div>
      </div>

      <GetStarted />
    </section>
  );
};

export default Pricing;
