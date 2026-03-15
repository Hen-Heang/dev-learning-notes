"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Settings, LayoutGrid, ChevronRight, NotebookPen, PlusSquare, Plus, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
import { TechIcon, getTechColor } from "@/components/TechIcon";
import { BrandLockup } from "@/components/BrandLockup";
import { createNoteAction } from "@/app/actions/notes";

interface NavItem {
  slug: string;
  title: string;
  icon: string;
}

interface SidebarProps {
  notes: NavItem[];
}

function CreateNoteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
    </button>
  );
}

export function Sidebar({ notes }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-zinc-800/60 bg-zinc-950 h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-zinc-800/60">
        <BrandLockup />
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-8 py-5">
        <div>
          <h3 className="px-3 mb-3 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            Overview
          </h3>
          <Link href="/">
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200",
                pathname === "/"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
              )}
            >
              <LayoutGrid size={18} />
              <span className="font-medium">Dashboard</span>
            </div>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 mb-3">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
              Knowledge Base
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-700 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-zinc-800/50">
                {notes.length}
              </span>
              <form action={createNoteAction}>
                <input type="hidden" name="title" value={`New Note ${notes.length + 1}`} />
                <CreateNoteButton />
              </form>
            </div>
          </div>

          <nav className="space-y-1">
            {notes.map((note) => {
              const active = pathname === `/notes/${note.slug}`;
              const color = getTechColor(note.icon || note.slug);

              return (
                <Link key={note.slug} href={`/notes/${note.slug}`}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 border border-transparent",
                      active
                        ? "bg-zinc-900/80 text-zinc-100 border-zinc-800 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30"
                    )}
                  >
                    <TechIcon
                      name={note.icon}
                      className={cn(
                        "transition-transform duration-300",
                        active
                          ? "scale-110"
                          : "group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      )}
                      size={16}
                    />
                    <span className="truncate font-medium">{note.title}</span>

                    {active ? (
                      <motion.div
                        layoutId="sidebar-active"
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-300"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-3 mb-3 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            Workspace
          </h3>

          <Link href="/#workspace">
            <div className="rounded-2xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/12 to-transparent px-4 py-4 text-zinc-200 transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/10">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
                    <NotebookPen size={16} />
                  </div>
                  <span className="text-sm font-semibold">Quick Notes</span>
                </div>
                <PlusSquare size={16} className="text-emerald-400/80" />
              </div>
              <p className="text-xs leading-5 text-zinc-400">
                Add, edit, pin, and delete personal notes without touching the markdown docs.
              </p>
            </div>
          </Link>
        </div>
      </div>

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
