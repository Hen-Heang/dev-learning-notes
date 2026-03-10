"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  slug: string;
  title: string;
  icon: string;
}

export function MobileSidebar({ notes }: { notes: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col"
            >
              <div className="px-5 py-5 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-100">🇰🇷 Dev Notes</span>
                <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {notes.map((note) => {
                  const active = pathname === `/notes/${note.slug}`;
                  return (
                    <Link key={note.slug} href={`/notes/${note.slug}`} onClick={() => setOpen(false)}>
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        active
                          ? "bg-zinc-800 text-zinc-100 font-medium"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                      )}>
                        <span>{note.icon}</span>
                        <span>{note.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
