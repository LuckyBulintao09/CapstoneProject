const Title = () => {
	return (
		// <section className='w-full p-2 mb-4'>
		// 	<div className='flex justify-between items-center mt-4'>
		// 		<div>
		// 			<h1 className='font-semibold text-3xl dark:text-white'>Favorites</h1>
		// 		</div>
		// 		<h1 className='font-bold text-3xl md:text-4xl lg:text-5xl'>Profile</h1>
		// 		<p>Manage your account information and settings.</p>
		// 	</div>
		// </section>
		<div className='h-full relative mb-8 bg-background dark:bg-secondary flex flex-col'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='font-semibold text-3xl dark:text-white'>Profile</h1>
					<p>Manage your account information.</p>
				</div>
			</div>
		</div>
	);
};

export default Title;
