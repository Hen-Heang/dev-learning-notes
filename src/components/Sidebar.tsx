"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { TechIcon, getTechColor } from "@/components/TechIcon";
import { BrandLockup } from "@/components/BrandLockup";

interface NavItem {
  slug: string;
  title: string;
}

interface SidebarProps {
  notes: NavItem[];
}

export function Sidebar({ notes }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-zinc-800/60 bg-zinc-950 h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-zinc-800/60">
        <BrandLockup />
      </div>

      <div className="px-5 pt-4 pb-1.5">
        <span className="text-[10px] font-mono text-zinc-700 tracking-wider uppercase">{"// notes"}</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {notes.map((note) => {
          const active = pathname === `/notes/${note.slug}`;
          const color = getTechColor(note.slug);

          return (
            <Link key={note.slug} href={`/notes/${note.slug}`}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150",
                  active
                    ? "bg-zinc-800/80 text-zinc-100 font-medium"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40"
                )}
              >
                <span style={active ? {} : { filter: "grayscale(1)", opacity: 0.5 }}>
                  <TechIcon slug={note.slug} size={16} />
                </span>
                <span className="truncate">{note.title}</span>
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-zinc-800/60 space-y-1">
        <Link href="/admin">
          <motion.div
            whileHover={{ x: 3 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40 transition-all duration-150"
          >
            <Settings size={15} className="shrink-0" />
            <span className="font-medium">Owner Panel</span>
          </motion.div>
        </Link>
        <p className="text-[11px] font-mono text-zinc-700 px-3">{"// keep shipping"}</p>
      </div>
    </aside>
  );
}
