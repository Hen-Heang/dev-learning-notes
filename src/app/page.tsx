import { getAllNotes } from "@/lib/notes";
import { getTasksAction } from "@/app/actions/tasks";
import { NoteSearch } from "@/components/NoteSearch";
import { QuickNotesWorkspace } from "@/components/QuickNotesWorkspace";
import { StudyTasks } from "@/components/StudyTasks";
import { Sparkles, Terminal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [notes, tasks] = await Promise.all([getAllNotes(), getTasksAction()]);

  return (
    <div className="px-6 sm:px-10 py-10 sm:py-16 max-w-5xl mx-auto pb-safe">
      <div className="relative mb-16 sm:mb-24">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <Sparkles size={14} className="text-emerald-300" />
          <span>Knowledge Base 2026</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-white mb-8 tracking-tight leading-[1.05] text-balance">
          Master the Korean <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Enterprise Stack.
          </span>
        </h1>

        <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl mb-10 font-medium">
          A curated collection of practical notes for the standard Korean IT ecosystem.
          Focusing on <span className="text-emerald-400/90">stability</span>,{" "}
          <span className="text-emerald-400/90">scalability</span>, and{" "}
          <span className="text-emerald-400/90 font-bold italic">enterprise-grade patterns</span>.
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          {[
            { label: "Spring Boot 3.x", icon: "🌱" },
            { label: "MyBatis / JPA", icon: "🧮" },
            { label: "PostgreSQL", icon: "🗃️" },
            { label: "Modern Frontend", icon: "⚡" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 text-base text-zinc-200 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-bold tracking-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
        <div className="lg:col-span-8">
          <div className="flex items-end justify-between mb-10 border-b border-zinc-800/60 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Terminal size={24} className="text-emerald-400" />
                </div>
                Available Topics
              </h2>
              <p className="text-base text-zinc-500 mt-2 font-medium">Select a module to start learning</p>
            </div>
            <div className="hidden sm:block text-xs font-mono font-bold text-zinc-500 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800/50 tracking-tighter">
              {notes.length} MODULES LOADED
            </div>
          </div>

          <NoteSearch notes={notes} />
        </div>

        <div className="lg:col-span-4 space-y-12 sm:space-y-16">
          <div className="relative">
            <h3 className="text-xs font-black text-zinc-400 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              Learning Roadmap
            </h3>

            <div className="space-y-5 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800/80">
              {[
                { phase: "01", label: "Core Foundation", status: "done", desc: "Java & SQL Mastery" },
                { phase: "02", label: "Backend Dev", status: "done", desc: "Spring Boot & MyBatis" },
                { phase: "03", label: "Frontend Legacy", status: "current", desc: "JSP, JSTL & jQuery" },
                { phase: "04", label: "Deployment", status: "todo", desc: "CI/CD & Cloud" },
              ].map((step) => (
                <div
                  key={step.phase}
                  className={`group relative pl-12 pr-4 py-4 rounded-2xl transition-all duration-300 ${
                    step.status === "current"
                      ? "bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)]"
                      : "hover:bg-zinc-900/30"
                  }`}
                >
                  <div
                    className={`absolute left-[20px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 z-10 transition-colors duration-500 ${
                      step.status === "done"
                        ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : step.status === "current"
                          ? "bg-zinc-950 border-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                          : "bg-zinc-950 border-zinc-800"
                    }`}
                  />
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold ${step.status === 'todo' ? 'text-zinc-700' : 'text-emerald-500/50'}`}>PHASE {step.phase}</span>
                      <h4
                        className={`text-base font-bold tracking-tight ${
                          step.status === "todo" ? "text-zinc-500" : "text-zinc-100"
                        }`}
                      >
                        {step.label}
                      </h4>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[linear-gradient(145deg,rgba(16,185,129,0.08),rgba(20,184,166,0.03))] border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors duration-700" />
            
            <h4 className="text-sm font-black text-emerald-400 mb-6 tracking-widest uppercase">Overall Progress</h4>
            <div className="space-y-4">
              <div className="h-3 w-full bg-zinc-950/50 rounded-full overflow-hidden border border-zinc-800/50 p-0.5">
                <div 
                  className="h-full w-[65%] bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] relative"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-white/20 skew-x-12" />
                </div>
              </div>
              <div className="flex justify-between text-xs font-mono font-bold text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">65%</span> COMPLETE
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LEVEL 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 sm:mt-32">
        <StudyTasks initialTasks={tasks} />
      </div>

      <div className="mt-20 sm:mt-32">
        <QuickNotesWorkspace />
      </div>
    </div>
  );
}
