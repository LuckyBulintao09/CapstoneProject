'use client';
import React, { useEffect, useState } from 'react';
import BranchListings from '@/components/cardListings/BranchListings';
import { createClient } from '@/utils/supabase/client';
import LoadingPage from '@/components/LoadingPage';

const supabase = createClient();
interface HeroSectionProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
}

export default function FavoriteListings({
	searchTerm,
	setSearchTerm,
}: HeroSectionProps) {
	const [favorites, setFavorites] = useState([]);
	const [userId, setUserId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkSession = async () => {
			try {
				const { data, error } = await supabase.auth.getSession();
				if (error) {
					console.error('Error fetching session:', error.message);
					setError('Failed to fetch session.');
					setLoading(false);
					return;
				}

				console.log('Session data:', data);
				if (!data?.session?.user) {
					console.warn('User not authenticated. Please log in.');
					setError('User not authenticated.');
					setLoading(false);
					return;
				}

				const user = data.session.user;
				setUserId(user.id);
				console.log('Authenticated User ID:', user.id);
			} catch (error) {
				console.error('Error fetching session data:', error.message);
				setError('An error occurred while fetching session information.');
				setLoading(false);
			}
		};

		checkSession();
	}, []);

	useEffect(() => {
		if (userId) {
			console.log('Fetching favorites for User ID:', userId);

			const fetchFavorites = async () => {
				try {
					const { data, error } = await supabase.rpc('get_all_fav', {
						user_id: userId,
					});

					if (error) {
						throw error;
					}

					// console.log('Fetched Favorites Data:', data);
					// const favoriteProperties = data.map((fav) => fav.unit);
					// setFavorites(favoriteProperties || []);
					setFavorites(data || []);
				} catch (error) {
					console.error('Error fetching favorites:', error.message);
					setError('Failed to fetch favorite properties');
				} finally {
					setLoading(false);
				}
			};

			fetchFavorites();
		}
	}, [userId]);

	const filteredFavorites = favorites.filter((item) =>
		item.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return (
			<div>
				<LoadingPage />
			</div>
		);
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (favorites.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<p className='text-lg font-semibold'>
					You don't have any favorite properties yet.
				</p>
				<p className='text-sm text-gray-500'>
					Start adding listings to your favorites and they will show up here.
				</p>
			</div>
		);
	}

	if (filteredFavorites.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<p className='text-lg font-semibold'>No favorite properties found.</p>
				<p className='text-sm text-gray-500'>
					Try searching for a specific property or adding more listings to your
					favorites.
				</p>
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col justify-between'>
			<div className='grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1'>
				{filteredFavorites.map((item) => (
					<div key={item.id}>
						<BranchListings key={item.id} {...item} />
					</div>
				))}
			</div>
		</div>
	);
}
