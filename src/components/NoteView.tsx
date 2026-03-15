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
import Link from "next/link";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { updateNoteAction } from "@/app/actions/notes";

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

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  // Called by NoteBlockEditor on every block save (auto-persist)
  const handleSave = async (content: string, meta: { title: string; description: string; icon: string }) => {
    await updateNoteAction(slug, content, meta);
  };

  // Called when the user clicks "Done" — exits edit mode and refreshes
  const handleCancel = () => {
    setIsEditing(false);
    router.replace(`/notes/${slug}`);
    router.refresh();
  };

  return (
    <>
      <ReadingProgress />
      <CodeCopy />
      <PageTransition>
        <div className="flex justify-center max-w-[1440px] mx-auto min-h-screen">
          <div className="flex-1 px-6 sm:px-10 py-10 sm:py-12 max-w-4xl min-w-0 pb-safe">
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
                {/* Header Section */}
                <div className="mb-12">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                      <Link href="/" className="hover:text-emerald-400 transition-colors">home</Link>
                      <span className="text-zinc-800">/</span>
                      <span className="text-zinc-400">notes</span>
                      <span className="text-zinc-800">/</span>
                      <span className="text-emerald-500/80">{slug}</span>
                    </div>

                    <NoteActions slug={slug} onEdit={() => setIsEditing(true)} />
                  </div>

                  {/* Title & Icon */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow-2xl">
                      <TechIcon name={note.icon} size={32} />
                    </div>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                        {note.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-zinc-700" />
                          <span>Updated March 2026</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-zinc-700" />
                          <span>8 min read</span>
                        </div>
                        <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          Verified
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-linear-to-r from-zinc-800 via-zinc-800 to-transparent mt-10" />
                </div>

                {/* Content */}
                <article
                  className="prose prose-zinc prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* Footer Navigation */}
                <div className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center">
                  <Link 
                    href="/"
                    className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Overview
                  </Link>
                  <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                    End of Module
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="hidden xl:block py-12 px-6 sticky top-0 h-screen overflow-hidden">
              <TableOfContents html={html} />
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
}
