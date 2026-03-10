import { getAllNotes, getNoteContent } from "@/lib/notes";
import { renderMarkdown } from "@/lib/highlight";
import { PageTransition } from "@/components/PageTransition";
import { ReadingProgress } from "@/components/ReadingProgress";
import { CodeCopy } from "@/components/CodeCopy";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { title } = getNoteContent(slug);
    return { title: `${title} — Dev Notes` };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let note;
  try {
    note = getNoteContent(slug);
  } catch {
    notFound();
  }

  const html = await renderMarkdown(note.content);

  return (
    <>
      <ReadingProgress />
      <CodeCopy />
      <PageTransition>
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto pb-safe">
          {/* Breadcrumb / back */}
          <div className="flex items-center gap-2 mb-8 text-xs font-mono text-zinc-600">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-zinc-400 transition-colors"
            >
              <ChevronLeft size={13} />
              notes
            </Link>
            <span>/</span>
            <span className="text-zinc-500">{slug}</span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{note.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 leading-tight tracking-tight">
                {note.title}
              </h1>
            </div>
            <div className="h-px bg-linear-to-r from-emerald-400/30 via-zinc-700 to-transparent mt-6" />
          </div>

          {/* Content */}
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </PageTransition>
    </>
  );
}
