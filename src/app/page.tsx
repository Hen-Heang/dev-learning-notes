import { getAllNotes } from "@/lib/notes";
import { NoteSearch } from "@/components/NoteSearch";

export default function Home() {
  const notes = getAllNotes();

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-4xl mx-auto pb-safe">
      {/* Hero */}
      <div className="mb-10">
        <p className="text-xs font-mono text-emerald-400 mb-3 tracking-widest uppercase">
          {"// dev-learning-notes"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3 leading-tight tracking-tight">
          Korean Enterprise Dev Notes
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
          Practical learning notes for the standard Korean enterprise stack —{" "}
          <span className="text-zinc-300 font-medium">Spring Boot</span>,{" "}
          <span className="text-zinc-300 font-medium">MyBatis</span>,{" "}
          <span className="text-zinc-300 font-medium">JSP/JSTL</span>,{" "}
          <span className="text-zinc-300 font-medium">jQuery</span>, and{" "}
          <span className="text-zinc-300 font-medium">PostgreSQL</span>.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { label: "eGovFrame", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
            { label: "SI Companies", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
            { label: "Banking & Finance", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
          ].map(({ label, color }) => (
            <span
              key={label}
              className={`text-xs font-mono px-3 py-1 rounded-full border ${color}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-mono text-zinc-600">{"// topics"}</span>
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-600 tabular-nums">{notes.length} notes</span>
      </div>

      {/* Search + Cards */}
      <NoteSearch notes={notes} />

      {/* Roadmap */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-mono text-zinc-600">{"// roadmap"}</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="border border-zinc-800/60 rounded-xl overflow-hidden bg-zinc-900/30 backdrop-blur-sm">
          {[
            { phase: "01", label: "Java core + SQL basics", done: true },
            { phase: "02", label: "Spring Boot + MyBatis dynamic SQL", done: true },
            { phase: "03", label: "JSP/JSTL + jQuery AJAX", done: false },
            { phase: "04", label: "Full project — build, deploy, ship", done: false },
          ].map(({ phase, label, done }, i, arr) => (
            <div
              key={phase}
              className={`flex items-center gap-4 px-5 py-3.5 text-sm ${
                i < arr.length - 1 ? "border-b border-zinc-800" : ""
              }`}
            >
              <span className={`font-mono text-xs shrink-0 ${done ? "text-emerald-400" : "text-zinc-600"}`}>
                {done ? "✓" : "○"} {phase}
              </span>
              <span className={done ? "text-zinc-400" : "text-zinc-500"}>{label}</span>
              {done && (
                <span className="ml-auto text-xs font-mono text-emerald-400/60">done</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
