import type { Metadata } from "next";
import "./globals.css";
import { getAllNotes } from "@/lib/notes";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { BrandLockup } from "@/components/BrandLockup";

export const metadata: Metadata = {
  title: "Dev Learning Notes - Korean Enterprise Stack",
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
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const notes = await getAllNotes();

  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar notes={notes} />

          <div className="flex-1 flex flex-col min-w-0">
            <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/78 backdrop-blur-xl sticky top-0 z-30 pt-safe">
              <MobileSidebar notes={notes} />
              <BrandLockup compact className="min-w-0 flex-1" />
            </header>

            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
