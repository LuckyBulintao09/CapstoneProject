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
					const { data, error } = await supabase
						.rpc('get_user_favorites', { user_id: userId })

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
		return <div>No favorite properties found.</div>;
	}

	if (filteredFavorites.length === 0) {
		return <div>No favorite properties found.</div>;
	}

	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-2 sm:grid-cols-3 xs:grid-cols-2'>
			{filteredFavorites.slice(0, 4).map((item) => (
				<div key={item.id}>
					<BranchListings key={item.id} {...item} />
				</div>
			))}
		</div>
	);
}
