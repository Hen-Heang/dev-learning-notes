"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface NoteCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  index: number;
}

export function NoteCard({ slug, title, description, icon, index }: NoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
    >
      <Link href={`/notes/${slug}`} className="block h-full">
        <div className="h-full border border-zinc-800 rounded-xl p-5 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors group">
          <div className="flex items-start gap-3">
            <span className="text-3xl mt-0.5">{icon}</span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
                {title}
              </h2>
              <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-zinc-600 group-hover:text-emerald-400 transition-colors">
            <span>Open notes →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
