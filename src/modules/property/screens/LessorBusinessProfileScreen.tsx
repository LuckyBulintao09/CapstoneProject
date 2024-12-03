import { BusinessLogo } from '../../property/components/BusinessLogo';
import { LucideMessageCircle, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BusinessDetails } from '../../property/components/BusinessDetails';
import { getSpecificCompany } from '@/actions/company/getSpecificCompany';
import ContactProprietorButton from '@/components/ui/contactProprietorButton';

const LessorBusinessProfileScreen = async ({
	companyId,
}: {
	companyId: { params: { id: number }; searchParams: object };
}) => {
	const data = await getSpecificCompany(companyId.params.id);
	return (
		<div className='h-full py-16 flex flex-col min-h-screen bg-background dark:bg-secondary'>
			<div className='px-32 md:px-24 sm:px-20 xs:px-10'>
				<div className=''>
					<div className='dark:text-white' />
					<div className=''>
						<div className='grid grid-cols-4 gap-2'>
							<div className='flex items-center md:col-span-3 sm:col-span-4 xs:col-span-4'>
								<BusinessLogo />
								<div className='pt-4 w-full'>
									<div className='flex flex-col'>
										<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-left dark:text-white ml-4 mb-1'>
											{data.company?.company_name}
										</h1>
										<p className='flex items-center text-foreground text-sm md:text-md lg:text-lg ml-4'>
											<MapPin className='mr-1' height={18} width={18} />
											{data.company?.address}
										</p>
									</div>
								</div>
							</div>

							<div className='hidden md:flex flex-col items-center justify-start mx-auto py-10 relative z-10'>
								<div className='flex flex-col items-center'>
									<Avatar className='mb-1'>
										<AvatarImage src={data?.owner?.profile_url} />
										<AvatarFallback>
											{data?.owner?.firstname.charAt(0)}
											{data?.owner?.lastname.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<h1 className='font-semibold xl:text-md text-center dark:text-primary-foreground'>
										{data?.owner?.firstname} {data?.owner?.lastname}
									</h1>
									<p className='text-sm text-foreground'>Proprietor</p>
								</div>
								<ContactProprietorButton ownerId={data?.owner?.id} />
							</div>
						</div>
					</div>

					<div className='md:hidden py-4'>
						<div className='flex items-center p-2 border-y py-4 justify-between'>
							<div className='flex items-center'>
								<Avatar className='mb-1'>
									<AvatarImage src={data?.owner?.profile_url} />
									<AvatarFallback>
										{data?.owner?.firstname.charAt(0)}
										{data?.owner?.lastname.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className='flex flex-col ml-4'>
									<p className='text-sm text-gray-700'>Contact Proprietor</p>
									<h1 className='font-semibold xl:text-md dark:text-primary-foreground'>
										{data?.owner?.firstname} {data?.owner?.lastname}
									</h1>
								</div>
							</div>
							<Button className='text-xs p-0 m-0 ml-auto' variant='link'>
								<LucideMessageCircle className='mr-1' height={20} width={20} />
							</Button>
						</div>
					</div>
				</div>

				<BusinessDetails
					companyName={data.company?.company_name}
					about={data.company?.about}
					created_at={data.company?.created_at}
					companyId={data.company?.id}
					firstname={data.owner?.firstname}
					lastname={data.owner?.lastname}
					email={data.owner?.email}
					cp_number={data.owner?.cp_number}
				/>
			</div>
		</div>
	);
};

export default LessorBusinessProfileScreen;
