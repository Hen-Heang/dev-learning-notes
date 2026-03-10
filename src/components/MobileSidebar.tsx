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
        className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setOpen(false)}
            />
            {/* Drawer — fully opaque so nothing bleeds through */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col"
            >
              {/* Dynamic Island / notch safe area */}
              <div className="pt-safe" />
              <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-emerald-400">&gt;_</span>
                  <span className="text-sm font-semibold text-zinc-100">dev-notes</span>
                </div>
                <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-200 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Section label */}
              <div className="px-5 pt-4 pb-1.5">
                <span className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase">{"// notes"}</span>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5 pb-safe">
                {notes.map((note) => {
                  const active = pathname === `/notes/${note.slug}`;
                  return (
                    <Link key={note.slug} href={`/notes/${note.slug}`} onClick={() => setOpen(false)}>
                      <div className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150",
                        active
                          ? "bg-zinc-800 text-zinc-100 font-medium"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                      )}>
                        <span className="text-base leading-none shrink-0">{note.icon}</span>
                        <span className="truncate">{note.title}</span>
                        {active && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="px-5 py-4 border-t border-zinc-800">
                <p className="text-[11px] font-mono text-zinc-700">{"// 화이팅! 🚀"}</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
