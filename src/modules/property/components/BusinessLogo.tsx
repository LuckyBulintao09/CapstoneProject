'use client';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import G1 from '../../../../public/Logo.png';
import Image from 'next/image';

export function BusinessLogo() {
	return (
		<>
			<Card className='h-[150px] w-[150px] border-none'>
				<CardContent className='flex items-center justify-center p-0 h-full w-full'>
					<Image
						src={G1}
						alt='Logo'
						className='object-cover max-h-full max-w-full rounded-md'
					/>
				</CardContent>
			</Card>
		</>
	);
}
