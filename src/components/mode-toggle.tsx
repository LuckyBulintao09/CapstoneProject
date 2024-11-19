'use client';

import * as React from 'react';
import { Moon, Sun, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	// Toggle between light and dark themes
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	return (
		<Button
			variant='ghost'
			size='icon'
			className='h-9 w-9 hover:bg-transparent'
			onClick={toggleTheme}
			aria-label='Toggle theme'
		>
			{theme === 'light' ? (
				<Sun className='h-[1.2rem] w-[1.2rem]' />
			) : (
				<Moon className='h-[1.2rem] w-[1.2rem]' />
			)}
		</Button>
	);
}
