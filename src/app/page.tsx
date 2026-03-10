import { getAllNotes } from "@/lib/notes";
import { NoteSearch } from "@/components/NoteSearch";

export default function Home() {
  const notes = getAllNotes();

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-4xl mx-auto pb-safe">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">
          Korean Enterprise Dev Notes
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
          Practical learning notes for the standard Korean enterprise stack —
          Spring Boot, MyBatis, JSP/JSTL, jQuery, and PostgreSQL.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {["🏛️ eGovFrame", "🏢 SI Companies", "🏦 Banking & Finance"].map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Search + Cards */}
      <NoteSearch notes={notes} />

      {/* Roadmap */}
      <div className="mt-12 border border-zinc-800 rounded-xl p-5 sm:p-6 bg-zinc-900/40">
        <h2 className="text-sm font-semibold text-zinc-300 mb-4">Learning Roadmap</h2>
        <ol className="space-y-2">
          {[
            { phase: "Phase 1", label: "Java core + SQL basics" },
            { phase: "Phase 2", label: "Spring Boot + MyBatis dynamic SQL" },
            { phase: "Phase 3", label: "JSP/JSTL + jQuery AJAX" },
            { phase: "Phase 4", label: "Full project — build, deploy, ship" },
          ].map(({ phase, label }) => (
            <li key={phase} className="flex items-center gap-3 text-sm">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded w-16 text-center shrink-0">
                {phase}
              </span>
              <span className="text-zinc-400">{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
