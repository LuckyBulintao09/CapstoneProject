import { Button } from "@/components/ui/button";
import spiels from "@/lib/constants/spiels";
const GetStarted = () => {
  return (
    <section className="h-full my-32">
      <div className="flex flex-col mx-5 text-center ">
        <div className="flex justify-center">
          <div className="text-4xl font-extrabold w-[80%]">
            <h1 className="">Get Started Today!</h1>
          </div>
        </div>
        <div className="mt-8 px-6 ">
          <p className="text-lg">
            Ready to maximize your property’s potential? Sign up now and take
            advantage of our simple and cost-effective pricing plans. Let’s make
            your condominium the top choice for travelers!
          </p>
        </div>
        <div className="flex justify-center">
          <Button className="mt-6 md:mt-12 w-[80%] ">
            {spiels.BUTTON_START_NOW}
          </Button>
        </div>
      </div>
    </section>
  );
};
export default GetStarted;
