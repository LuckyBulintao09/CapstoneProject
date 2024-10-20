import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { NUIProvider } from "@/components/next-ui-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from "@/components/navbar/Navbar";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "UniHomes",
    description: "Real estate platform for UniHomes",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NUIProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <TooltipProvider>
                            <div>{children}</div>
                           
                        </TooltipProvider>
                    </ThemeProvider>
                </NUIProvider>
            </body>
        </html>
    );
}
