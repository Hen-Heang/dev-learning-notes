"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { TechIcon, getTechColor } from "@/components/TechIcon";

interface NoteCardProps {
  slug: string;
  title: string;
  description: string;
  index: number;
}

export function NoteCard({ slug, title, description, index }: NoteCardProps) {
  const accentColor = getTechColor(slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 28, delay: index * 0.06 }}
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 25 } }}
      whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 500, damping: 30 } }}
    >
      <Link href={`/notes/${slug}`} className="block h-full">
        <div className="relative h-full border border-zinc-800/70 rounded-xl p-5 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700/80 hover:bg-zinc-800/40 transition-all duration-200 group overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(to right, transparent, ${accentColor}60, transparent)` }}
          />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-2 rounded-lg bg-zinc-800/60 group-hover:bg-zinc-800 transition-colors shrink-0">
              <TechIcon slug={slug} size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
                {title}
              </h2>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">{description}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors">
              /{slug}
            </span>
            <span className="text-[11px] font-mono text-zinc-600 group-hover:text-emerald-400 transition-colors">
              open -&gt;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
