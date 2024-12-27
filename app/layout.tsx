import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/navbar/Navbar";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1 flex flex-col gap-20 items-center max-w-5xl p-5 pt-[76px] sm:pt-[90px] md:pt-[100px]">
              {children}
            </main>
            <footer className="flex flex-col items-center py-5 dark:bg-secondary border-t">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-1 text-xs text-muted-foreground p-2">
                <span>Copyright @ 2024 | SDO - IFUGAO | Schools Governance and Operations Division Online Support System</span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
