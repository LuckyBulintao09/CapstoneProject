import pricing from '@/lib/constants/pricing';

const Landing = () => {
	return (
		<section className='h-full py-8'>
			<div className='flex flex-col mx-5 text-center'>
				<div className='flex justify-center'>
					<div className='text-2xl font-extrabold'>
						<h1 className=''>{pricing.PRICING_PLAN}</h1>
					</div>
				</div>
				<hr className='my-4 border-gray-300' />
				<div className='md:mt-3 px-6 '>
					<p className='text-md px-10'>{pricing.PRICING_PLAN_BODY}</p>
				</div>
			</div>
		</section>
	);
};
export default Landing;
