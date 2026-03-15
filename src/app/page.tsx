import { getAllNotes } from "@/lib/notes";
import { getTasksAction } from "@/app/actions/tasks";
import { NoteSearch } from "@/components/NoteSearch";
import { QuickNotesWorkspace } from "@/components/QuickNotesWorkspace";
import { StudyTasks } from "@/components/StudyTasks";
import { Sparkles, Terminal, CheckCircle2, Circle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [notes, tasks] = await Promise.all([getAllNotes(), getTasksAction()]);

  return (
    <div className="px-6 sm:px-10 py-12 sm:py-16 max-w-5xl mx-auto pb-safe">
      <div className="relative mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6">
          <Sparkles size={12} />
          <span>Knowledge Base 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
          Master the Korean <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            Enterprise Stack.
          </span>
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
          A curated collection of practical notes for the standard Korean IT ecosystem.
          Focusing on <span className="text-zinc-200">stability</span>,{" "}
          <span className="text-zinc-200">scalability</span>, and{" "}
          <span className="text-zinc-200">enterprise-grade patterns</span>.
        </p>

        <div className="flex flex-wrap gap-3">
          {[
            { label: "Spring Boot 3.x", icon: "🌱" },
            { label: "MyBatis / JPA", icon: "🧮" },
            { label: "PostgreSQL", icon: "🗃️" },
            { label: "Modern Frontend", icon: "⚡" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-sm text-zinc-300 backdrop-blur-sm"
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal size={20} className="text-emerald-400" />
                Available Topics
              </h2>
              <p className="text-sm text-zinc-500 mt-1">Select a module to start learning</p>
            </div>
            <div className="text-xs font-mono text-zinc-600 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800/50">
              {notes.length} MODULES
            </div>
          </div>

          <NoteSearch notes={notes} />
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div>
            <h3 className="text-sm font-bold text-zinc-200 mb-6 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Learning Roadmap
            </h3>

            <div className="space-y-4">
              {[
                { phase: "01", label: "Core Foundation", status: "done", desc: "Java & SQL Mastery" },
                { phase: "02", label: "Backend Dev", status: "done", desc: "Spring Boot & MyBatis" },
                { phase: "03", label: "Frontend Legacy", status: "current", desc: "JSP, JSTL & jQuery" },
                { phase: "04", label: "Deployment", status: "todo", desc: "CI/CD & Cloud" },
              ].map((step) => (
                <div
                  key={step.phase}
                  className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                    step.status === "current"
                      ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_20px_-10px_rgba(16,185,129,0.2)]"
                      : "bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 ${
                        step.status === "done"
                          ? "text-emerald-500"
                          : step.status === "current"
                            ? "text-emerald-400 animate-pulse"
                            : "text-zinc-700"
                      }`}
                    >
                      {step.status === "done" ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-500">{step.phase}</span>
                        <h4
                          className={`text-sm font-bold ${
                            step.status === "todo" ? "text-zinc-500" : "text-zinc-200"
                          }`}
                        >
                          {step.label}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-linear-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
            <h4 className="text-sm font-bold text-emerald-400 mb-4">Study Progress</h4>
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-emerald-500 rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>65% COMPLETE</span>
                <span>LEVEL 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <StudyTasks initialTasks={tasks} />
      </div>

      <div className="mt-16 sm:mt-20">
        <QuickNotesWorkspace />
      </div>
    </div>
  );
}
