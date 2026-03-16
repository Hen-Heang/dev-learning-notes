"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface Tip {
  emoji: string;
  tip: string;
  detail: string;
}

interface AiTipsProps {
  noteTitle: string;
  noteContent: string;
}

const CACHE_KEY = (title: string) => `ai_tips_${title.toLowerCase().replace(/\s+/g, "_")}`;

export function AiTips({ noteTitle, noteContent }: AiTipsProps) {
  const cacheKey = CACHE_KEY(noteTitle);
  const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
  const cachedTips: Tip[] = cached ? JSON.parse(cached) : [];

  const [tips, setTips] = useState<Tip[]>(cachedTips);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [generated, setGenerated] = useState(cachedTips.length > 0);

  const fetchTips = async (bustCache = false) => {
    if (!bustCache && tips.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: noteTitle, content: noteContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch tips");
      setTips(data.tips);
      setGenerated(true);
      setExpandedIndex(null);
      sessionStorage.setItem(cacheKey, JSON.stringify(data.tips));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Sparkles size={13} className="text-violet-400" />
          </div>
          <span className="text-[11px] font-mono font-black uppercase tracking-[0.18em] text-zinc-400">
            AI Tips
          </span>
        </div>
        {generated && !loading && (
          <button
            onClick={() => fetchTips(true)}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50 transition-all"
            title="Regenerate tips"
          >
            <RefreshCw size={12} />
          </button>
        )}
      </div>

      <div className="p-4">
        {/* Not yet generated */}
        {!generated && !loading && (
          <div className="text-center py-4">
            <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
              Get practical tips and real-world advice for this topic from OpenAI.
            </p>
            <button
              onClick={() => void fetchTips()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:border-violet-500/40 transition-all text-xs font-black uppercase tracking-wider active:scale-[0.98]"
            >
              <Sparkles size={13} />
              Generate Tips
            </button>
            {error && (
              <p className="mt-3 text-xs text-red-400">
                {error.includes("429") || error.includes("quota")
                  ? "Rate limit reached. Wait a minute and try again."
                  : error}
              </p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-6 gap-3">
            <Loader2 size={20} className="text-violet-400 animate-spin" />
            <p className="text-[11px] text-zinc-600 font-mono">Generating tips...</p>
          </div>
        )}

        {/* Tips list */}
        {generated && !loading && tips.length > 0 && (
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="rounded-xl border border-zinc-800/50 overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900/40 transition-all"
                >
                  <span className="text-base shrink-0">{tip.emoji}</span>
                  <span className="text-xs font-bold text-zinc-300 flex-1 leading-snug">{tip.tip}</span>
                  {expandedIndex === i
                    ? <ChevronUp size={12} className="text-zinc-600 shrink-0" />
                    : <ChevronDown size={12} className="text-zinc-600 shrink-0" />
                  }
                </button>
                {expandedIndex === i && (
                  <div className="px-4 pb-3 pt-0">
                    <p className="text-[11px] text-zinc-500 leading-relaxed pl-7">{tip.detail}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
