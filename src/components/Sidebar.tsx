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
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800/60">
        <Link href="/" className="block group">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-emerald-400 select-none">&gt;_</span>
            <span className="text-sm font-semibold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
              dev-notes
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-600 pl-5">korean enterprise stack</p>
        </Link>
      </div>

      {/* Section label */}
      <div className="px-5 pt-4 pb-1.5">
        <span className="text-[10px] font-mono text-zinc-700 tracking-wider uppercase">{"// notes"}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {notes.map((note) => {
          const active = pathname === `/notes/${note.slug}`;
          return (
            <Link key={note.slug} href={`/notes/${note.slug}`}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150",
                  active
                    ? "bg-zinc-800/80 backdrop-blur-sm text-zinc-100 font-medium"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40"
                )}
              >
                <span className="text-base leading-none shrink-0">{note.icon}</span>
                <span className="truncate">{note.title}</span>
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-zinc-800/60">
        <p className="text-[11px] font-mono text-zinc-700">{"// 화이팅! 🚀"}</p>
      </div>
    </aside>
  );
}
