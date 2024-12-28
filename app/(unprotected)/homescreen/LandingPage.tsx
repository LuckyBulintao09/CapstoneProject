import Hero from '@/components/landing-page/hero';
import Howitworks from '@/components/landing-page/Howitworks';
import { Separator } from '@/components/ui/separator';
import React from 'react';

function LandingPage() {
  return (
    <>
      <div className="flex flex-col gap-6 px-2 sm:px-4 md:px-6 lg:px-8 p-3 justify-start items-start"> 
        <div className="w-full flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex-shrink-0">
            <Hero />
          </div>
          <div className="w-full lg:w-1/3 h-full flex items-center justify-center">
            <img
              src="/trio-logo.png"
              alt="Hero Image"
              className="object-contain w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      <Separator className='mt-24' />

      <div className="flex-1 flex flex-col gap-6 px-2 sm:px-4 md:px-6 lg:px-8 items-start justify-center p-3 m-8">
        <div className="flex flex-col items-center justify-center w-full">
          <Howitworks />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
