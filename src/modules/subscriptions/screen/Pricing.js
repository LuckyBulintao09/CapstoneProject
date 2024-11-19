import Boost1 from '../components/Boost1';
import HowItWorks1 from '../components/HowItWorks1';
import GetStarted from '../components/GetStarted';
import { FAQS } from '../components/FAQs';
import PricingTextArea from '../components/PricingTextArea';
import pricing from '@/lib/constants/pricing';
const Pricing = () => {
	return (
		<div className='dark:bg-secondary'>
			<section className='pt-[5%] xl:mx-[15%]'>
				{/* 1ST SECTION */}
				<PricingTextArea
					title={pricing.PRICING_PLAN}
					description={pricing.PRICING_PLAN_BODY}
				/>

				{/* 2ND SECTION - ACCORDION  */}
				<FAQS />

				{/* 3RD SECTION */}
				<div className='flex flex-col md:flex-row flex-col-reverse py-8 px-10'>
					<div className='md:w-[55%]'>
						<Boost1 />
					</div>

					<div className='md:w-[50%] flex justify-center items-center'>
						<PricingTextArea
							title={pricing.BENEFITS_OF_BOOSTING}
							description={pricing.BENEFITS_OF_BOOSTING_BODY}
						/>
					</div>
				</div>

				{/* 4TH SECTION */}
				<div className='flex flex-col flex-col-reverse py-8 px-8'>
					<div>
						<HowItWorks1 />
					</div>
					<div>
						<PricingTextArea
							title={pricing.HOW_IT_WORKS}
							description={pricing.HOW_IT_WORKS_BODY}
						/>
					</div>
				</div>

				{/* 5TH SECTION */}
				<div className='py-12'>
					<GetStarted />
				</div>
			</section>
		</div>
	);
};

export default Pricing;
