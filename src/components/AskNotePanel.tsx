"use client";

import { useState } from "react";
import { Bot, Loader2, MessageSquareText, SendHorizonal } from "lucide-react";

interface AskNotePanelProps {
  noteTitle: string;
  noteContent: string;
}

interface AskNoteResult {
  answer: string;
  takeaways: string[];
}

const STARTER_QUESTIONS = [
  "Explain this note in simpler English.",
  "What should I memorize from this note?",
  "What beginner mistakes happen here?",
  "Give me 3 practice tasks from this note.",
];

export function AskNotePanel({ noteTitle, noteContent }: AskNotePanelProps) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskNoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(nextQuestion: string) {
    const trimmed = nextQuestion.trim();
    if (!trimmed) return;

    setQuestion(trimmed);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/ask-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
          question: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to ask this note");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] bg-zinc-950/60 border border-zinc-800/60 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/40">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Bot size={14} className="text-cyan-300" />
        </div>
        <div>
          <div className="text-[11px] font-mono font-black uppercase tracking-[0.18em] text-zinc-400">
            Ask This Note
          </div>
          <p className="text-xs text-zinc-500">Question-first study help from your note content.</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {STARTER_QUESTIONS.map((starter) => (
            <button
              key={starter}
              onClick={() => void submit(starter)}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-400 hover:text-cyan-200 hover:border-cyan-500/30 transition-colors disabled:opacity-50"
            >
              {starter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">
            Your question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this note..."
            rows={4}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/40 resize-none"
          />
          <button
            onClick={() => void submit(question)}
            disabled={loading || !question.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/40 disabled:opacity-50 transition-colors text-xs font-black uppercase tracking-[0.18em]"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <SendHorizonal size={14} />}
            Ask
          </button>
        </div>

        {error && (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error}
          </p>
        )}

        {result && !loading && (
          <div className="space-y-4 rounded-[1.5rem] border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 text-[11px] font-mono font-black uppercase tracking-[0.18em] text-cyan-300">
              <MessageSquareText size={13} />
              Answer
            </div>
            <p className="text-sm leading-7 text-zinc-300">{result.answer}</p>
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-black uppercase tracking-[0.18em] text-zinc-500">
                Key takeaways
              </div>
              <ul className="space-y-2">
                {result.takeaways.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2 text-xs leading-6 text-zinc-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
