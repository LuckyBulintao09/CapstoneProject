import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from '@nextui-org/react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const supabase = createClient();

const LandmarkModal = ({
	isOpen,
	onOpenChange,
	onAddLandmark,
	selectedLocation,
	isLoaded,
}) => {
	const [landmarkName, setLandmarkName] = useState('');
	const [mapCenter, setMapCenter] = useState(
		selectedLocation || { lat: 14.5995, lng: 120.9842 }
	);
	const [selectedMarker, setSelectedMarker] = useState(selectedLocation);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (selectedLocation) {
			setMapCenter(selectedLocation);
			setSelectedMarker(selectedLocation);
		}
	}, [selectedLocation]);

	const insertLandmarkToDB = async (name, location) => {
		try {
			const { data, error } = await supabase.from('landmarks').insert([
				{
					name,
					location: `SRID=4326;POINT(${location.lng} ${location.lat})`,
				},
			]);

			if (error) {
				console.error('Supabase insert error:', error.message);
				toast.error('Failed to add landmark. Please try again.');
				return false;
			}
			toast.success('Landmark added successfully!');
			return true;
		} catch (error) {
			console.error('Unexpected error:', error.message);
			toast.error('An unexpected error occurred. Please try again.');
			return false;
		}
	};

	const handleAddLandmark = async () => {
		if (landmarkName && selectedMarker) {
			setIsSubmitting(true);
			const success = await insertLandmarkToDB(landmarkName, selectedMarker);
			setIsSubmitting(false);

			if (success) {
				onAddLandmark(landmarkName, selectedMarker);
				setLandmarkName('');
				setSelectedMarker(null);
				onOpenChange(false);
			}
		} else {
			toast.error('Please provide a name and select a location on the map.');
		}
	};

	if (!isLoaded) {
		return <div>Loading map...</div>;
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent className='rounded-lg dark:bg-secondary'>
				<ModalHeader>Add New Landmark</ModalHeader>
				<ModalBody>
					<Input
						value={landmarkName}
						onChange={(e) => setLandmarkName(e.target.value)}
						placeholder='Enter the name of the landmark'
					/>
					<GoogleMap
						mapContainerStyle={{ width: '100%', height: '300px' }}
						center={mapCenter}
						zoom={13}
						onClick={(e) => {
							const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
							setSelectedMarker(location);
							setMapCenter(location);
						}}
					>
						{selectedMarker && <Marker position={selectedMarker} />}
					</GoogleMap>
				</ModalBody>
				<ModalFooter>
					<Button
						color='primary'
						onClick={handleAddLandmark}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Adding...' : 'Add Landmark'}
					</Button>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default LandmarkModal;
