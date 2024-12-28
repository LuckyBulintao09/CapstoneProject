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
          <div >
              {children}
            <footer className="flex-shrink-0 flex flex-col items-center py-5 dark:bg-secondary border-t">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-1 text-xs text-muted-foreground p-2">
                <span>Copyright @ 2024 | Schools Governance and Operations Division Online Support System | SDO - IFUGAO </span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
