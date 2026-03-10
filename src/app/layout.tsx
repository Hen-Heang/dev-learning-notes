import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getAllNotes } from "@/lib/notes";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Dev Learning Notes — Korean Enterprise Stack",
  description: "Spring Boot, MyBatis, JSP/JSTL, jQuery, PostgreSQL learning notes",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DevNotes",
  },
  icons: {
    apple: "/apple-touch-icon.svg",
    icon: "/icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const notes = getAllNotes();

  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <Sidebar notes={notes} />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile top bar — glass */}
            <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-30 pt-safe">
              <MobileSidebar notes={notes} />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-emerald-400">&gt;_</span>
                <span className="text-sm font-semibold text-zinc-100">dev-notes</span>
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
