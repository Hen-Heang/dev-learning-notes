"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (title: string) => void;
  color?: string;
}

export function QuickAdd({ onAdd, color = '#007AFF' }: Props) {
  const [active, setActive] = useState(false);
  const [value, setValue]   = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) { setActive(false); setValue(''); return; }
    onAdd(trimmed);
    setValue('');
    inputRef.current?.focus();
  }

  return (
    <div className="border-t border-zinc-100 dark:border-zinc-800/60 px-4 py-3 shrink-0">
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-3"
          >
            {/* Placeholder circle */}
            <div
              className="w-5 h-5 rounded-md border-2 shrink-0 opacity-50"
              style={{ borderColor: color }}
            />

            <input
              ref={inputRef}
              autoFocus
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter')  submit();
                if (e.key === 'Escape') { setActive(false); setValue(''); }
              }}
              onBlur={() => { if (!value.trim()) { setActive(false); } }}
              placeholder="What needs to be done?"
              className="flex-1 bg-transparent text-[15px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none"
            />

            <AnimatePresence>
              {value.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  onClick={submit}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: color, color: 'white' }}
                >
                  Create
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setActive(true)}
            className="flex items-center gap-3 text-[15px] font-bold w-full group transition-all"
            style={{ color }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm"
              style={{ backgroundColor: color }}
            >
              <Plus size={14} color="white" strokeWidth={3} />
            </div>
            New Task
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
