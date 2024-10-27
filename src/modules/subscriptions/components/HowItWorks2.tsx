import pricing from '@/lib/constants/pricing';

const Boost2 = () => {
	return (
		<section className=' '>
			<div className='flex flex-col'>
				<div className='flex justify-center text-center'>
					<div className='text-2xl font-extrabold'>
						<h1 className=''>{pricing.HOW_IT_WORKS}</h1>
					</div>
				</div>
				<hr className='my-6 border-gray-300 md:hidden' />
				<div className='my-4'>
					<p className='text-md text-center'>{pricing.HOW_IT_WORKS_BODY}</p>
				</div>
			</div>
		</section>
	);
};
export default Boost2;
