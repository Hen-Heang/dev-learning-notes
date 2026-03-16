"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";
import { ReadingProgress } from "@/components/ReadingProgress";
import { CodeCopy } from "@/components/CodeCopy";
import { TechIcon } from "@/components/TechIcon";
import { NoteActions } from "@/components/NoteActions";
import { NoteBlockEditor } from "@/components/NoteBlockEditor";
import { TableOfContents } from "@/components/TableOfContents";
import { AiTips } from "@/components/AiTips";
import { AskNotePanel } from "@/components/AskNotePanel";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, ShieldCheck, Share2, Brain, ChevronDown } from "lucide-react";
import { updateNoteAction } from "@/app/actions/notes";
import { QuizModal } from "@/components/QuizModal";

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

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

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
      <PageTransition>
        <div className="flex justify-center max-w-[1440px] mx-auto min-h-screen">
          <div className="flex-1 px-6 sm:px-12 py-8 sm:py-16 max-w-4xl min-w-0 pb-safe">
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
                <div className="mb-16">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    {/* Breadcrumb with modern style */}
                    <div className="flex items-center gap-3 text-[11px] font-mono font-black uppercase tracking-[0.2em] text-zinc-600">
                      <Link href="/" className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">HOME</Link>
                      <span className="text-zinc-800">/</span>
                      <span className="text-zinc-500">MODULES</span>
                      <span className="text-zinc-800">/</span>
                      <span className="text-emerald-500 font-black">{slug}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all active:scale-95 text-xs font-black uppercase tracking-wider"
                      >
                        <Brain size={15} />
                        Quiz
                      </button>
                      <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all active:scale-95 shrink-0">
                        <Share2 size={18} />
                      </button>
                      <NoteActions slug={slug} onEdit={() => setIsEditing(true)} />
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-emerald-500/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-10">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] transition-transform duration-500 hover:scale-110">
                        <TechIcon name={note.icon} size={48} />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-4 text-balance">
                          {note.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-5 text-sm font-mono font-bold text-zinc-500">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <Calendar size={16} className="text-emerald-500/60" />
                            <span>MARCH 2026</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <Clock size={16} className="text-emerald-500/60" />
                            <span>8 MIN READ</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400">
                            <ShieldCheck size={16} />
                            <span>VERIFIED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-linear-to-r from-emerald-500/20 via-zinc-800 to-transparent mt-12" />
                </div>

                {/* Mobile TOC accordion — hidden on xl+ (sidebar handles it there) */}
                <div className="xl:hidden mb-8">
                  <button
                    onClick={() => setShowMobileToc((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                  >
                    <span>Table of Contents</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showMobileToc ? "rotate-180" : ""}`} />
                  </button>
                  {showMobileToc && (
                    <div className="mt-2 px-4 py-4 rounded-xl bg-zinc-950 border border-zinc-800">
                      <TableOfContents html={html} mobile />
                    </div>
                  )}
                </div>

                {/* Content with enhanced readability */}
                <article
                  className="prose prose-zinc prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* Mobile AiTips — hidden on xl+ (sidebar handles it there) */}
                <div className="xl:hidden mt-10 space-y-6">
                  <AskNotePanel noteTitle={note.title} noteContent={note.content} />
                  <AiTips noteTitle={note.title} noteContent={note.content} />
                </div>

                {/* Modernized Footer Navigation */}
                <div className="mt-24 pt-12 border-t border-zinc-900/80 flex flex-col sm:flex-row justify-between items-center gap-8">
                  <Link 
                    href="/"
                    className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-base font-black text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all duration-300 active:scale-[0.98]"
                  >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
                    BACK TO OVERVIEW
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="text-[11px] font-mono font-black text-zinc-600 uppercase tracking-[0.3em]">
                      END OF MODULE LOADED
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="hidden xl:flex flex-col gap-6 py-16 px-8 sticky top-0 h-screen overflow-y-auto w-80">
              <AskNotePanel noteTitle={note.title} noteContent={note.content} />
              <div className="p-6 rounded-[2rem] bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/60">
                <TableOfContents html={html} />
              </div>
              <AiTips noteTitle={note.title} noteContent={note.content} />
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
}
