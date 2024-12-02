import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
// import { NUIProvider } from '@/components/next-ui-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import GoogleMapsProvider from '@/components/GoogleMapsProvider';
import QueryProvider from '@/components/TansTackQueryProvider';
import { Toaster } from 'sonner';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'UniHomes',
	description: 'Real estate platform for UniHomes',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<QueryProvider>
					{/* <NUIProvider> */}
					<ThemeProvider
						attribute='class'
						defaultTheme='light'
						enableSystem
						disableTransitionOnChange
					>
						<GoogleMapsProvider
							google_maps_api_key={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
						>
							<TooltipProvider>
								<Toaster 
								position='top-right' 
								closeButton
								richColors
								toastOptions={{
									classNames: {
										closeButton: "absolute cursor-pointer bg-background text-foreground border border-black hover:bg-black hover:text-foreground dark:bg-black dark:hover:bg-foreground dark:hover:text-black "
									},
								}}
								/>
								<div>{children}</div>
							</TooltipProvider>
						</GoogleMapsProvider>
					</ThemeProvider>
					{/* </NUIProvider> */}
				</QueryProvider>
			</body>
		</html>
	);
}
