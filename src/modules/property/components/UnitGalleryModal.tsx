/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { use } from 'react';
import { createClient } from "@/utils/supabase/client";

interface UnitGalleryModalProps {
	isOpen: boolean;
	onClose: () => void;
	unitID: number;
}

const UnitGalleryModal: React.FC<UnitGalleryModalProps> = ({
	isOpen,
	onClose,
	unitID,
}) => {
	const supabase = createClient();
	const [images, setImages] = React.useState<string[]>([]);

	React.useEffect(() => {
		const fetchImages = async () => {
			const { data, error } = await supabase
				.from('unit')
				.select('unit_image')
				.eq('id', unitID);

				// setImages(data[0].unit_image);
		}

		fetchImages();
	}, []);
	
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='p-6 max-w-7xl bg-white mx-2 dark:bg-secondary'>
				<DialogHeader>
					<DialogTitle className='text-primary dark:text-gray-100'>
						Room Title Gallery
					</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue='rooms'>
					<hr className='border-t border-gray-300' />

					{/* ROOM VIEW */}
					{/* <TabsContent value='rooms' className='h-[450px] mt-0'>
						<div>
							<ScrollArea className='h-[430px] overflow-y-auto pr-4 my-4'>
								<div className='grid grid-cols-3 gap-4'>
									{images.map((url, index) => (
										<img
											key={index}
											src={url}
											alt={`property image ${index + 1}`}
											className='rounded-md object-cover w-full h-full transition-all duration-300 ease-in-out transform hover:brightness-75 cursor-pointer'
										/>
									))}
								</div>
							</ScrollArea>
						</div>
					</TabsContent> */}
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default UnitGalleryModal;
