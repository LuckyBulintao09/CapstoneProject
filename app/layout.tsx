import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://deped-sgodoss.vercel.app/";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SGODOSS",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
          <Toaster 
								position='bottom-right' 
								closeButton
								richColors
								toastOptions={{
									classNames: {
										closeButton: "absolute cursor-pointer bg-background text-foreground border border-black hover:bg-black hover:text-foreground dark:bg-black dark:hover:bg-foreground dark:hover:text-black "
									},
								}}
								expand
								/>
            <main className="flex-grow">{children}</main>
            <Analytics />
            <SpeedInsights />
         
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
