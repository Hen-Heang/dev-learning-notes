"use client";

import { motion } from "motion/react";
import { CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";

interface RoadmapPhase {
  phase: string;
  week: string;
  label: string;
  detail: string;
  tags: string[];
  status: "done" | "active" | "upcoming";
}

const PHASES: RoadmapPhase[] = [
  {
    phase: "01",
    week: "Week 1–2",
    label: "Java & SQL Fundamentals",
    detail: "OOP, Collections, JDBC, SELECT/JOIN/Aggregates, basic DB design",
    tags: ["Java", "SQL", "JDBC"],
    status: "done",
  },
  {
    phase: "02",
    week: "Week 3–4",
    label: "Spring Boot + MyBatis CRUD",
    detail: "IoC/DI, @Controller, @Mapper, dynamic SQL, transaction management",
    tags: ["Spring Boot", "MyBatis", "REST"],
    status: "done",
  },
  {
    phase: "03",
    week: "Week 5–6",
    label: "JSP/JSTL + jQuery Workflow",
    detail: "Server-side rendering, JSTL tags, AJAX calls, form validation",
    tags: ["JSP", "JSTL", "jQuery", "AJAX"],
    status: "active",
  },
  {
    phase: "04",
    week: "Week 7–8",
    label: "Korean Enterprise Patterns",
    detail: "eGovFrame, .do URL pattern, VO/DTO/DAO, Oracle, SI project structure",
    tags: ["eGovFrame", "Oracle", "SI"],
    status: "upcoming",
  },
  {
    phase: "05",
    week: "Week 9–10",
    label: "Full Project — Build & Deploy",
    detail: "End-to-end feature: login, CRUD board, file upload, deploy to server",
    tags: ["Project", "Deploy", "Portfolio"],
    status: "upcoming",
  },
];

const STATUS_CONFIG = {
  done: {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    lineColor: "bg-emerald-400/40",
    labelColor: "text-zinc-300",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    badgeText: "Completed",
  },
  active: {
    icon: Clock,
    iconColor: "text-amber-400",
    dotColor: "bg-amber-400",
    lineColor: "bg-zinc-800",
    labelColor: "text-zinc-100",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    badgeText: "In Progress",
  },
  upcoming: {
    icon: Circle,
    iconColor: "text-zinc-600",
    dotColor: "bg-zinc-700",
    lineColor: "bg-zinc-800",
    labelColor: "text-zinc-500",
    badge: "bg-zinc-800/60 text-zinc-600 border-zinc-700/40",
    badgeText: "Upcoming",
  },
};

const TAG_COLOR: Record<string, string> = {
  Java: "text-orange-400/80 bg-orange-400/8 border-orange-400/15",
  SQL: "text-sky-400/80 bg-sky-400/8 border-sky-400/15",
  JDBC: "text-sky-400/80 bg-sky-400/8 border-sky-400/15",
  "Spring Boot": "text-emerald-400/80 bg-emerald-400/8 border-emerald-400/15",
  MyBatis: "text-red-400/80 bg-red-400/8 border-red-400/15",
  REST: "text-purple-400/80 bg-purple-400/8 border-purple-400/15",
  JSP: "text-orange-400/80 bg-orange-400/8 border-orange-400/15",
  JSTL: "text-orange-400/80 bg-orange-400/8 border-orange-400/15",
  jQuery: "text-blue-400/80 bg-blue-400/8 border-blue-400/15",
  AJAX: "text-blue-400/80 bg-blue-400/8 border-blue-400/15",
  eGovFrame: "text-violet-400/80 bg-violet-400/8 border-violet-400/15",
  Oracle: "text-red-400/80 bg-red-400/8 border-red-400/15",
  SI: "text-zinc-400/80 bg-zinc-400/8 border-zinc-400/15",
  Project: "text-emerald-400/80 bg-emerald-400/8 border-emerald-400/15",
  Deploy: "text-sky-400/80 bg-sky-400/8 border-sky-400/15",
  Portfolio: "text-violet-400/80 bg-violet-400/8 border-violet-400/15",
};

const doneCount = PHASES.filter((p) => p.status === "done").length;
const progressPct = Math.round((doneCount / PHASES.length) * 100);

export function Roadmap() {
  return (
    <section className="mt-14">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase">{"// roadmap"}</span>
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[10px] font-mono text-zinc-600">{doneCount}/{PHASES.length} phases</span>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">Korea Adaptation Progress</span>
          <span className="text-xs font-mono text-emerald-400">{progressPct}%</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-6 bottom-6 w-px bg-zinc-800 hidden sm:block" />

        <div className="space-y-3">
          {PHASES.map((phase, i) => {
            const cfg = STATUS_CONFIG[phase.status];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              >
                <div
                  className={`relative flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    phase.status === "active"
                      ? "border-amber-400/20 bg-amber-400/[0.03]"
                      : phase.status === "done"
                      ? "border-zinc-800/60 bg-zinc-900/20"
                      : "border-zinc-800/40 bg-transparent"
                  }`}
                >
                  {/* Icon */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <Icon size={20} className={cfg.iconColor} />
                    {phase.status === "active" && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-amber-400/20"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-zinc-600">Phase {phase.phase}</span>
                      <span className="text-[10px] font-mono text-zinc-700">·</span>
                      <span className="text-[10px] font-mono text-zinc-600">{phase.week}</span>
                      <span
                        className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border ${cfg.badge}`}
                      >
                        {cfg.badgeText}
                      </span>
                    </div>

                    <p className={`text-sm font-semibold mb-1 ${cfg.labelColor}`}>{phase.label}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed mb-2.5">{phase.detail}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {phase.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${TAG_COLOR[tag] ?? "text-zinc-500 bg-zinc-800/40 border-zinc-700/40"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow for active */}
                  {phase.status === "active" && (
                    <div className="shrink-0 self-center">
                      <ChevronRight size={14} className="text-amber-400/60" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-xs text-zinc-700 font-mono text-center"
      >
        {"// 목표: 한국 SI 기업 적응 완료 🇰🇷"}
      </motion.p>
    </section>
  );
}
