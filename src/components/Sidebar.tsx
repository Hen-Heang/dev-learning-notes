"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

interface NavItem {
  slug: string;
  title: string;
  icon: string;
}

interface SidebarProps {
  notes: NavItem[];
}

export function Sidebar({ notes }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-zinc-800 bg-zinc-950 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <Link href="/" className="block">
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            🇰🇷 Dev Learning Notes
          </span>
          <p className="text-[11px] text-zinc-500 mt-0.5">Korean Enterprise Stack</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {notes.map((note) => {
          const active = pathname === `/notes/${note.slug}`;
          return (
            <Link key={note.slug} href={`/notes/${note.slug}`}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-zinc-800 text-zinc-100 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                <span className="text-base leading-none">{note.icon}</span>
                <span>{note.title}</span>
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-zinc-800">
        <p className="text-[11px] text-zinc-600">화이팅! 🚀</p>
      </div>
    </aside>
  );
}
