'use client';
import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const World = dynamic(
	() => import('./../../../components/ui/globe').then((m) => m.World),
	{
		ssr: false,
	}
);

export function Globe() {
	const globeConfig = {
		pointSize: 4,
		globeColor: '#0c4a6e',
		showAtmosphere: true,
		atmosphereColor: '#e0f2fe',
		atmosphereAltitude: 0.1,
		emissive: '#062056',
		emissiveIntensity: 0.1,
		shininess: 0.9,
		polygonColor: 'rgba(255,255,255,255)',
		ambientLight: '#082f49',
		directionalLeftLight: '#ffffff',
		directionalTopLight: '#ffffff',
		pointLight: '#ffffff',
		arcTime: 1000,
		arcLength: 0.9,
		rings: 1,
		maxRings: 4,
		initialPosition: { lat: 22.3193, lng: 114.1694 },
		autoRotate: true,
		autoRotateSpeed: 0.5,
	};

	const colors = ['#06b6d4', '#3b82f6', '#6366f1'];
	const sampleArcs = [
		{
			order: 1,
			startLat: -19.885592,
			startLng: -43.951191,
			endLat: -22.9068,
			endLng: -43.1729,
			arcAlt: 0.1,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 1,
			startLat: 28.6139,
			startLng: 77.209,
			endLat: 3.139,
			endLng: 101.6869,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 1,
			startLat: -19.885592,
			startLng: -43.951191,
			endLat: -1.303396,
			endLng: 36.852443,
			arcAlt: 0.5,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 2,
			startLat: 1.3521,
			startLng: 103.8198,
			endLat: 35.6762,
			endLng: 139.6503,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 2,
			startLat: 51.5072,
			startLng: -0.1276,
			endLat: 3.139,
			endLng: 101.6869,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 2,
			startLat: -15.785493,
			startLng: -47.909029,
			endLat: 36.162809,
			endLng: -115.119411,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 3,
			startLat: -33.8688,
			startLng: 151.2093,
			endLat: 22.3193,
			endLng: 114.1694,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 3,
			startLat: 21.3099,
			startLng: -157.8581,
			endLat: 40.7128,
			endLng: -74.006,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 3,
			startLat: -6.2088,
			startLng: 106.8456,
			endLat: 51.5072,
			endLng: -0.1276,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 4,
			startLat: 11.986597,
			startLng: 8.571831,
			endLat: -15.595412,
			endLng: -56.05918,
			arcAlt: 0.5,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 4,
			startLat: -34.6037,
			startLng: -58.3816,
			endLat: 22.3193,
			endLng: 114.1694,
			arcAlt: 0.7,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 4,
			startLat: 51.5072,
			startLng: -0.1276,
			endLat: 48.8566,
			endLng: -2.3522,
			arcAlt: 0.1,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 5,
			startLat: 14.5995,
			startLng: 120.9842,
			endLat: 51.5072,
			endLng: -0.1276,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 5,
			startLat: 1.3521,
			startLng: 103.8198,
			endLat: -33.8688,
			endLng: 151.2093,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 5,
			startLat: 34.0522,
			startLng: -118.2437,
			endLat: 48.8566,
			endLng: -2.3522,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 6,
			startLat: -15.432563,
			startLng: 28.315853,
			endLat: 1.094136,
			endLng: -63.34546,
			arcAlt: 0.7,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 6,
			startLat: 37.5665,
			startLng: 126.978,
			endLat: 35.6762,
			endLng: 139.6503,
			arcAlt: 0.1,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 6,
			startLat: 22.3193,
			startLng: 114.1694,
			endLat: 51.5072,
			endLng: -0.1276,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 7,
			startLat: -19.885592,
			startLng: -43.951191,
			endLat: -15.595412,
			endLng: -56.05918,
			arcAlt: 0.1,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 7,
			startLat: 48.8566,
			startLng: -2.3522,
			endLat: 52.52,
			endLng: 13.405,
			arcAlt: 0.1,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 7,
			startLat: 52.52,
			startLng: 13.405,
			endLat: 34.0522,
			endLng: -118.2437,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 8,
			startLat: -8.833221,
			startLng: 13.264837,
			endLat: -33.936138,
			endLng: 18.436529,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 8,
			startLat: 49.2827,
			startLng: -123.1207,
			endLat: 52.3676,
			endLng: 4.9041,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 8,
			startLat: 1.3521,
			startLng: 103.8198,
			endLat: 40.7128,
			endLng: -74.006,
			arcAlt: 0.5,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 9,
			startLat: 51.5072,
			startLng: -0.1276,
			endLat: 34.0522,
			endLng: -118.2437,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 9,
			startLat: 22.3193,
			startLng: 114.1694,
			endLat: -22.9068,
			endLng: -43.1729,
			arcAlt: 0.7,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 9,
			startLat: 1.3521,
			startLng: 103.8198,
			endLat: -34.6037,
			endLng: -58.3816,
			arcAlt: 0.5,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 10,
			startLat: -22.9068,
			startLng: -43.1729,
			endLat: 28.6139,
			endLng: 77.209,
			arcAlt: 0.7,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 10,
			startLat: 34.0522,
			startLng: -118.2437,
			endLat: 31.2304,
			endLng: 121.4737,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 10,
			startLat: -6.2088,
			startLng: 106.8456,
			endLat: 52.3676,
			endLng: 4.9041,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 11,
			startLat: 41.9028,
			startLng: 12.4964,
			endLat: 34.0522,
			endLng: -118.2437,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 11,
			startLat: -6.2088,
			startLng: 106.8456,
			endLat: 31.2304,
			endLng: 121.4737,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 11,
			startLat: 22.3193,
			startLng: 114.1694,
			endLat: 1.3521,
			endLng: 103.8198,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 12,
			startLat: 34.0522,
			startLng: -118.2437,
			endLat: 37.7749,
			endLng: -122.4194,
			arcAlt: 0.1,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 12,
			startLat: 35.6762,
			startLng: 139.6503,
			endLat: 22.3193,
			endLng: 114.1694,
			arcAlt: 0.2,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 12,
			startLat: 22.3193,
			startLng: 114.1694,
			endLat: 34.0522,
			endLng: -118.2437,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 13,
			startLat: 52.52,
			startLng: 13.405,
			endLat: 22.3193,
			endLng: 114.1694,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 13,
			startLat: 11.986597,
			startLng: 8.571831,
			endLat: 35.6762,
			endLng: 139.6503,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 13,
			startLat: -22.9068,
			startLng: -43.1729,
			endLat: -34.6037,
			endLng: -58.3816,
			arcAlt: 0.1,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
		{
			order: 14,
			startLat: -33.936138,
			startLng: 18.436529,
			endLat: 21.395643,
			endLng: 39.883798,
			arcAlt: 0.3,
			color: colors[Math.floor(Math.random() * (colors.length - 1))],
		},
	];
	const houseMarkers = [
		// North America
		{ lat: 40.7128, lng: -74.006, size: 1, color: '#67e8f9' }, // New York City, USA
		{ lat: 34.0522, lng: -118.2437, size: 1, color: '#67e8f9' }, // Los Angeles, USA
		{ lat: 37.7749, lng: -122.4194, size: 1, color: '#67e8f9' }, // San Francisco, USA
		{ lat: 47.6062, lng: -122.3321, size: 1, color: '#67e8f9' }, // Seattle, USA
		{ lat: 40.7306, lng: -73.9352, size: 1, color: '#67e8f9' }, // Chicago, USA
		{ lat: 33.4484, lng: -112.074, size: 1, color: '#67e8f9' }, // Phoenix, USA
		{ lat: 19.4326, lng: -99.1332, size: 1, color: '#67e8f9' }, // Mexico City, Mexico
		{ lat: 45.4215, lng: -75.6972, size: 1, color: '#67e8f9' }, // Ottawa, Canada
		{ lat: 49.2827, lng: -123.1207, size: 1, color: '#67e8f9' }, // Vancouver, Canada
		{ lat: 51.2538, lng: -85.3232, size: 1, color: '#67e8f9' }, // Toronto, Canada

		// South America
		{ lat: -34.6037, lng: -58.3816, size: 1, color: '#67e8f9' }, // Buenos Aires, Argentina
		{ lat: -23.5505, lng: -46.6333, size: 1, color: '#67e8f9' }, // São Paulo, Brazil
		{ lat: -22.9068, lng: -43.1729, size: 1, color: '#67e8f9' }, // Rio de Janeiro, Brazil
		{ lat: -15.7801, lng: -47.9292, size: 1, color: '#67e8f9' }, // Brasília, Brazil
		{ lat: -16.5, lng: -68.1193, size: 1, color: '#67e8f9' }, // La Paz, Bolivia
		{ lat: -3.7172, lng: -73.265, size: 1, color: '#67e8f9' }, // Manaus, Brazil
		{ lat: -1.2884, lng: -78.4784, size: 1, color: '#67e8f9' }, // Quito, Ecuador
		{ lat: -12.0464, lng: -77.0428, size: 1, color: '#67e8f9' }, // Lima, Peru
		{ lat: -33.4489, lng: -70.6693, size: 1, color: '#67e8f9' }, // Santiago, Chile
		{ lat: -22.9068, lng: -43.1729, size: 1, color: '#67e8f9' }, // Rio de Janeiro, Brazil

		// Europe
		{ lat: 51.5074, lng: -0.1278, size: 1, color: '#67e8f9' }, // London, UK
		{ lat: 48.8566, lng: 2.3522, size: 1, color: '#67e8f9' }, // Paris, France
		{ lat: 55.7558, lng: 37.6176, size: 1, color: '#67e8f9' }, // Moscow, Russia
		{ lat: 52.52, lng: 13.405, size: 1, color: '#67e8f9' }, // Berlin, Germany
		{ lat: 41.9028, lng: 12.4964, size: 1, color: '#67e8f9' }, // Rome, Italy
		{ lat: 40.4168, lng: -3.7038, size: 1, color: '#67e8f9' }, // Madrid, Spain
		{ lat: 53.3498, lng: -6.2603, size: 1, color: '#67e8f9' }, // Dublin, Ireland
		{ lat: 48.2082, lng: 16.3738, size: 1, color: '#67e8f9' }, // Vienna, Austria
		{ lat: 59.9343, lng: 30.3351, size: 1, color: '#67e8f9' }, // St. Petersburg, Russia
		{ lat: 50.8503, lng: 4.3517, size: 1, color: '#67e8f9' }, // Brussels, Belgium

		// Africa
		{ lat: 6.5244, lng: 3.3792, size: 1, color: '#67e8f9' }, // Lagos, Nigeria
		{ lat: -1.2864, lng: 36.8172, size: 1, color: '#67e8f9' }, // Nairobi, Kenya
		{ lat: -33.9189, lng: 18.4233, size: 1, color: '#67e8f9' }, // Cape Town, South Africa
		{ lat: 30.0444, lng: 31.2357, size: 1, color: '#67e8f9' }, // Cairo, Egypt
		{ lat: 12.9716, lng: 77.5946, size: 1, color: '#67e8f9' }, // Bangalore, India
		{ lat: 15.3875, lng: 32.5599, size: 1, color: '#67e8f9' }, // Khartoum, Sudan
		{ lat: -22.5597, lng: 17.0832, size: 1, color: '#67e8f9' }, // Windhoek, Namibia
		{ lat: 36.737232, lng: 3.086472, size: 1, color: '#67e8f9' }, // Algiers, Algeria
		{ lat: 9.082, lng: 8.6753, size: 1, color: '#67e8f9' }, // Abuja, Nigeria
		{ lat: -4.0383, lng: 123.1731, size: 1, color: '#67e8f9' }, // Zanzibar City, Tanzania

		// Asia
		{ lat: 35.6895, lng: 139.6917, size: 1, color: '#67e8f9' }, // Tokyo, Japan
		{ lat: 39.9042, lng: 116.4074, size: 1, color: '#67e8f9' }, // Beijing, China
		{ lat: 37.5665, lng: 126.978, size: 1, color: '#67e8f9' }, // Seoul, South Korea
		{ lat: 1.3521, lng: 103.8198, size: 1, color: '#67e8f9' }, // Singapore
		{ lat: 13.7563, lng: 100.5018, size: 1, color: '#67e8f9' }, // Bangkok, Thailand
		{ lat: 28.6139, lng: 77.209, size: 1, color: '#67e8f9' }, // Delhi, India
		{ lat: 40.7128, lng: 74.006, size: 1, color: '#67e8f9' }, // New York, USA (placeholder for global comparisons)
		{ lat: 22.3193, lng: 114.1694, size: 1, color: '#67e8f9' }, // Hong Kong
		{ lat: 26.9124, lng: 75.7873, size: 1, color: '#67e8f9' }, // Jaipur, India
		{ lat: 37.7749, lng: -122.4194, size: 1, color: '#67e8f9' }, // San Francisco, USA (placeholder for global comparisons)

		// Australia
		{ lat: -33.8688, lng: 151.2093, size: 1, color: '#67e8f9' }, // Sydney, Australia
		{ lat: -37.8136, lng: 144.9631, size: 1, color: '#67e8f9' }, // Melbourne, Australia
		{ lat: -27.4698, lng: 153.0251, size: 1, color: '#67e8f9' }, // Brisbane, Australia
		{ lat: -31.9505, lng: 115.8605, size: 1, color: '#67e8f9' }, // Perth, Australia
		{ lat: -35.2809, lng: 149.13, size: 1, color: '#67e8f9' }, // Canberra, Australia
		{ lat: -28.0167, lng: 153.4, size: 1, color: '#67e8f9' }, // Gold Coast, Australia
		{ lat: -34.9285, lng: 138.6007, size: 1, color: '#67e8f9' }, // Adelaide, Australia
		{ lat: -32.9283, lng: 151.7817, size: 1, color: '#67e8f9' }, // Newcastle, Australia
		{ lat: -23.698, lng: 133.8807, size: 1, color: '#67e8f9' }, // Alice Springs, Australia
		{ lat: -19.2586, lng: 146.8161, size: 1, color: '#67e8f9' }, // Townsville, Australia
	];

	return (
		<div className='justify-center h-full relative w-full dark:bg-transparent'>
			<div className='max-w-auto mx-auto w-full relative overflow-visible h-full xl:h-[40rem] xlg:h-[32rem] lg:h-[42rem] xl:pl-10 md:h-[32rem] sm:h-[18rem] xs:h-[12rem]'>
				<motion.div
					initial={{
						opacity: 0,
						y: 20,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{
						duration: 1,
					}}
					className='div'
				></motion.div>
				<div className='absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none' />
				<div className='absolute w-full -bottom-15 h-72 md:h-full z-10'>
					<World
						data={[...sampleArcs, ...houseMarkers]}
						globeConfig={globeConfig}
					/>
				</div>
			</div>
		</div>
	);
}
