"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/PageTransition";
import { ReadingProgress } from "@/components/ReadingProgress";
import { CodeCopy } from "@/components/CodeCopy";
import { TechIcon } from "@/components/TechIcon";
import { NoteActions } from "@/components/NoteActions";
import { NoteBlockEditor } from "@/components/NoteBlockEditor";
import { AiTips } from "@/components/AiTips";
import { AskNotePanel } from "@/components/AskNotePanel";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, ShieldCheck, Share2, Brain, ChevronDown, List, ArrowUp } from "lucide-react";
import { updateNoteAction } from "@/app/actions/notes";
import { QuizModal } from "@/components/QuizModal";

const TableOfContents = dynamic(
  () => import("@/components/TableOfContents").then((mod) => mod.TableOfContents),
  { ssr: false }
);

interface NoteViewProps {
  slug: string;
  note: {
    content: string;
    title: string;
    icon: string;
    description: string;
  };
  html: string;
}

export function NoteView({ slug, note, html }: NoteViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [activeSectionLabel, setActiveSectionLabel] = useState("Contents");

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  useEffect(() => {
    if (isEditing) return;

    const onScroll = () => {
      setShowFloatingNav(window.scrollY > 500);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) return;

    const headingElements = Array.from(document.querySelectorAll("h2, h3"));
    if (headingElements.length === 0) {
      setActiveSectionLabel("Contents");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (!visibleEntry) return;

        const text = visibleEntry.target.textContent?.trim();
        if (!text) return;

        setActiveSectionLabel(text.length > 28 ? `${text.slice(0, 28)}...` : text);
      },
      { rootMargin: "-15% 0% -75% 0%" }
    );

    headingElements.forEach((element) => observer.observe(element));
    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, [html, isEditing]);

  const handleSave = async (content: string, meta: { title: string; description: string; icon: string }) => {
    await updateNoteAction(slug, content, meta);
  };

  const handleCancel = () => {
    setIsEditing(false);
    router.replace(`/notes/${slug}`);
    router.refresh();
  };

  return (
    <>
      {showQuiz && (
        <QuizModal
          noteTitle={note.title}
          noteContent={note.content}
          onClose={() => setShowQuiz(false)}
        />
      )}
      <ReadingProgress />
      <CodeCopy />
      {!isEditing && showFloatingNav && (
        <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => {
              setShowMobileToc(true);
              requestAnimationFrame(() => {
                document.getElementById("note-toc-mobile")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              });
            }}
            className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-zinc-950/90 px-4 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-300 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl active:scale-95 max-w-[16rem]"
          >
            <List size={14} className="shrink-0" />
            <span className="truncate">{activeSectionLabel || "Contents"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-300 shadow-2xl backdrop-blur-xl active:scale-95"
          >
            <ArrowUp size={14} />
            Top
          </button>
        </div>
      )}
      <PageTransition>
        <div className="flex justify-center max-w-[1440px] mx-auto min-h-screen relative">
          <div className="flex-1 px-4 sm:px-8 md:px-12 py-8 sm:py-16 max-w-4xl min-w-0 pb-safe">
            {isEditing ? (
              <NoteBlockEditor
                initialContent={note.content}
                initialTitle={note.title}
                initialDescription={note.description}
                initialIcon={note.icon}
                onSave={handleSave}
                onDone={handleCancel}
              />
            ) : (
              <>
                {/* Enhanced Header Section */}
                <div className="mb-12 sm:mb-16">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                    {/* Breadcrumb with modern style */}
                    <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-[0.2em] text-zinc-600">
                      <Link href="/" className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">HOME</Link>
                      <span className="text-zinc-800">/</span>
                      <span className="text-zinc-500">MODULES</span>
                      <span className="text-zinc-800">/</span>
                      <span className="text-emerald-500 font-black truncate max-w-[120px] sm:max-w-none">{slug}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all active:scale-95 text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap"
                      >
                        <Brain size={14} className="sm:w-[15px] sm:h-[15px]" />
                        Quiz
                      </button>
                      <button className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all active:scale-95 shrink-0">
                        <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                      <NoteActions slug={slug} onEdit={() => setIsEditing(true)} />
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-emerald-500/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] transition-transform duration-500 hover:scale-110 shrink-0">
                        <TechIcon name={note.icon} size={note.icon === 'react' ? 32 : 40} className="sm:w-[48px] sm:h-[48px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-4 text-balance">
                          {note.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[10px] sm:text-sm font-mono font-bold text-zinc-500">
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <Calendar size={14} className="sm:w-[16px] sm:h-[16px] text-emerald-500/60" />
                            <span>MARCH 2026</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <Clock size={14} className="sm:w-[16px] sm:h-[16px] text-emerald-500/60" />
                            <span>8 MIN READ</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400">
                            <ShieldCheck size={14} className="sm:w-[16px] sm:h-[16px]" />
                            <span>VERIFIED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-linear-to-r from-emerald-500/20 via-zinc-800 to-transparent mt-10 sm:mt-12" />
                </div>

                {/* Mobile TOC accordion — hidden on xl+ (sidebar handles it there) */}
                <div id="note-toc-mobile" className="xl:hidden mb-10 scroll-mt-24">
                  <button
                    onClick={() => setShowMobileToc((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl"
                  >
                    <span>Table of Contents</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${showMobileToc ? "rotate-180" : ""}`} />
                  </button>
                  {showMobileToc && (
                    <div className="mt-3 px-1 rounded-2xl bg-zinc-950 border border-zinc-900 animate-fade-in overflow-hidden">
                      <TableOfContents html={html} mobile />
                    </div>
                  )}
                </div>

                {/* Content with enhanced readability */}
                <article
                  className="prose prose-zinc prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg"
                  dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* Mobile Side Panels — hidden on xl+ (sidebar handles it there) */}
                <div className="xl:hidden mt-16 space-y-8 border-t border-zinc-900 pt-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AskNotePanel noteTitle={note.title} noteContent={note.content} />
                    <AiTips noteTitle={note.title} noteContent={note.content} />
                  </div>
                </div>

                {/* Modernized Footer Navigation */}
                <div className="mt-20 sm:mt-32 pt-12 border-t border-zinc-900/80 flex flex-col sm:flex-row justify-between items-center gap-8">
                  <Link 
                    href="/"
                    className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm sm:text-base font-black text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all duration-300 active:scale-[0.98] w-full sm:w-auto justify-center"
                  >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
                    BACK TO OVERVIEW
                  </Link>
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="text-[10px] sm:text-[11px] font-mono font-black text-zinc-600 uppercase tracking-[0.3em] whitespace-nowrap">
                      END OF MODULE LOADED
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="hidden xl:flex flex-col gap-6 py-16 px-8 sticky top-0 h-screen overflow-y-auto w-[22rem] shrink-0 border-l border-zinc-900/50 bg-zinc-950/20">
              <div className="space-y-6 animate-fade-in">
                <AskNotePanel noteTitle={note.title} noteContent={note.content} />
                <div className="p-6 rounded-[2rem] bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/60 shadow-2xl shadow-emerald-500/5">
                  <TableOfContents html={html} />
                </div>
                <AiTips noteTitle={note.title} noteContent={note.content} />
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
}
