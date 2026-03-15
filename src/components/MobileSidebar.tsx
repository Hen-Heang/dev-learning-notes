"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, NotebookPen, Settings, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/cn";
import { TechIcon } from "@/components/TechIcon";
import { BrandLockup } from "@/components/BrandLockup";

interface NavItem {
  slug: string;
  title: string;
  icon: string;
}

export function MobileSidebar({ notes }: { notes: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-100"
            onClick={() => setOpen(false)}
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-zinc-950/95 border-r border-zinc-800/50 z-101 flex flex-col shadow-2xl"
          >
            <div className="pt-safe" />

            <div className="px-6 py-6 border-b border-zinc-800/40 flex items-center justify-between gap-4">
              <BrandLockup compact className="min-w-0 flex-1" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2.5 text-zinc-500 hover:text-zinc-200 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-7 pt-8 pb-3 flex items-center gap-2">
              <LayoutGrid size={14} className="text-emerald-500" />
              <span className="text-[11px] font-mono font-black text-zinc-600 tracking-[0.2em] uppercase">Modules Library</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {notes.map((note) => {
                const active = pathname === `/notes/${note.slug}`;

                return (
                  <Link key={note.slug} href={`/notes/${note.slug}`} onClick={() => setOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] transition-all duration-300 active:scale-[0.98]",
                        active
                          ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300",
                        active ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "bg-zinc-950 border-zinc-800 text-zinc-500"
                      )}>
                        <TechIcon name={note.icon} size={20} />
                      </div>
                      <span className="truncate">{note.title}</span>
                      {active && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 pb-6 mt-4">
              <Link href="/#workspace" onClick={() => setOpen(false)}>
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-6 text-zinc-200 relative overflow-hidden group active:scale-[0.98] transition-transform">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full -mr-8 -mt-8" />
                  <div className="mb-3 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <NotebookPen size={18} />
                    </div>
                    <span className="text-[15px] font-black tracking-tight">Quick Notes</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-500 font-medium">
                    Personalized workspace for your daily tech stack updates.
                  </p>
                </div>
              </Link>
            </div>

            <div className="px-4 py-6 border-t border-zinc-800/40 pb-safe space-y-2">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all active:scale-[0.98]"
              >
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Settings size={18} className="shrink-0" />
                </div>
                <span className="font-bold">System Settings</span>
              </Link>
              <div className="px-5 flex items-center justify-between">
                <p className="text-[10px] font-mono font-bold text-zinc-700 tracking-widest uppercase">{"// keep shipping"}</p>
                <span className="text-[10px] font-mono text-zinc-800">v2.4.0</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-2.5 rounded-2xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-all border border-transparent active:border-zinc-700 active:scale-90"
      >
        <Menu size={24} />
      </button>

      {typeof document !== "undefined" && createPortal(drawer, document.body)}
    </div>
  );
}
