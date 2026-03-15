"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { TechIcon, getTechColor } from "@/components/TechIcon";

interface NoteCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  index: number;
}

export function NoteCard({ slug, title, description, icon, index }: NoteCardProps) {
  const accentColor = getTechColor(icon || slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05,
      }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link href={`/notes/${slug}`} className="block h-full group">
        <div className="relative h-full border border-zinc-800/50 rounded-2xl p-6 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-800/40 hover:border-zinc-700/50 transition-all duration-300 overflow-hidden flex flex-col">
          <div
            className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
          />

          <div className="relative flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-950/50 border border-zinc-800/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-zinc-950 transition-all duration-300 shadow-sm">
              <TechIcon name={icon} size={24} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors leading-tight truncate">
                {title}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Topic</span>
                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-600">/{slug}</span>
              </div>
            </div>
          </div>

          <p className="relative text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-6 flex-1">
            {description}
          </p>

          <div className="relative mt-auto pt-4 border-t border-zinc-800/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors">
              /{slug}
            </span>

            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 group-hover:text-emerald-400 transition-colors">
              <span>View Notes</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
