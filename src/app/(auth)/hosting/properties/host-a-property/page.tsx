'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { createProperty } from '@/actions/property/create-property';
import CustomBreadcrumbs from '@/modules/hosting/components/CustomBreadcrumbs';
import { ChevronRight, Copy, House, HousePlus } from 'lucide-react';

function HostAProperty() {
	// if there are properties whose columns are null then show finish listing
	return (
		<div className='px-32 md:px-24 sm:px-20 xs:px-10 p-5 bg-background dark:bg-secondary h-screen'>
			<CustomBreadcrumbs />
			<div className='mt-1 mb-4'>
				<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white'>
					Host a Property
				</h1>
			</div>
			<div className='w-full'>
				<div className='pb-16 w-full '>
					<h2 className='mb-4 text-lg leading-[1.625rem]'>
						Finish your listings
					</h2>
					<div role='group' className='pb-2 w-full '>
						<Button
							className='text-[1rem] leading-5 font-normal w-full justify-start py-11 px-5'
							variant='outline'
						>
							<span className='flex flex-row items-center justify-start'>
								<span className='mr-2'>
									<House className='size-6' />
								</span>
								<span className='flex-1 '>Current listing</span>
							</span>
						</Button>
					</div>
				</div>

				<div className='w-full'>
					<div className='w-full'>
						<h2 className='mb-4 text-lg leading-[1.625rem]'>
							Create a new property
						</h2>

						<div role='group'>
							<div className='w-full'>
								<div className='py-6 border-b'>
									<div className='flex items-center'>
										<div className='mr-4'>
											<HousePlus size={28} />
										</div>
										<div className='flex flex-col justify-center flex-auto w-full'>
											<Button
												variant='ghost'
												className='text-[1rem] leading-5 font-normal hover:bg-transparent'
												onClick={async () => {
													await createProperty();
												}}
											>
												<span className='text-left inline-flex justify-between items-start w-full min-h-5'>
													<div>Create new property</div>
													<span>
														<ChevronRight size={16} />
													</span>
												</span>
											</Button>
										</div>
									</div>
								</div>
							</div>
							<div className='w-full'>
								<div className='py-6 border-b'>
									<div className='flex items-center'>
										<div className='mr-4'>
											<Copy size={28} />
										</div>
										<div className='flex flex-col justify-center flex-auto w-full'>
											<Button
												variant='ghost'
												className='text-[1rem] leading-5 font-normal hover:bg-transparent'
											>
												<span className='text-left inline-flex justify-between items-start w-full min-h-5'>
													<div>Create from an existing listing</div>
													<span>
														<ChevronRight size={16} />
													</span>
												</span>
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HostAProperty;
