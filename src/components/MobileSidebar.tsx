"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, NotebookPen, Settings, X } from "lucide-react";
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-100"
            onClick={() => setOpen(false)}
          />

          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 z-101 flex flex-col"
          >
            <div className="pt-safe" />

            <div className="px-4 py-4 border-b border-zinc-800 flex items-center justify-between gap-3">
              <BrandLockup compact className="min-w-0 flex-1" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pt-4 pb-1.5">
              <span className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase">{"// notes"}</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
              {notes.map((note) => {
                const active = pathname === `/notes/${note.slug}`;

                return (
                  <Link key={note.slug} href={`/notes/${note.slug}`} onClick={() => setOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all duration-150",
                        active
                          ? "bg-zinc-800 text-zinc-100 font-medium"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                      )}
                    >
                      <TechIcon name={note.icon} size={16} />
                      <span className="truncate">{note.title}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="px-3 pb-4">
              <Link href="/#workspace" onClick={() => setOpen(false)}>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-zinc-200">
                  <div className="mb-2 flex items-center gap-2">
                    <NotebookPen size={16} className="text-emerald-400" />
                    <span className="text-sm font-semibold">Quick Notes</span>
                  </div>
                  <p className="text-xs leading-5 text-zinc-400">
                    Add and update personal notes from the dashboard workspace.
                  </p>
                </div>
              </Link>
            </div>

            <div className="px-3 py-4 border-t border-zinc-800 pb-safe space-y-1">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all duration-150"
              >
                <Settings size={15} className="shrink-0" />
                <span className="font-medium">Owner Panel</span>
              </Link>
              <p className="text-[11px] font-mono text-zinc-700 px-3">{"// keep shipping"}</p>
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
        className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
      >
        <Menu size={20} />
      </button>

      {typeof document !== "undefined" && createPortal(drawer, document.body)}
    </div>
  );
}
