import type { Metadata } from "next";
import "./globals.css";
import { getAllNotes } from "@/lib/notes";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";

export const metadata: Metadata = {
  title: "Dev Learning Notes — Korean Enterprise Stack",
  description: "Spring Boot, MyBatis, JSP/JSTL, jQuery, PostgreSQL learning notes",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DevNotes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover", // iPhone notch / Dynamic Island safe area
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const notes = getAllNotes();

  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <Sidebar notes={notes} />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile top bar */}
            <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-30 pt-safe">
              <MobileSidebar notes={notes} />
              <span className="text-sm font-semibold text-zinc-100">🇰🇷 Dev Notes</span>
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
