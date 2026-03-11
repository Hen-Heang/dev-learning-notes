import { getAllNotesSync, getNoteContent } from "@/lib/notes";
import { renderMarkdown } from "@/lib/highlight";
import { PageTransition } from "@/components/PageTransition";
import { ReadingProgress } from "@/components/ReadingProgress";
import { CodeCopy } from "@/components/CodeCopy";
import { TechIcon } from "@/components/TechIcon";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const NOTE_ALIASES: Record<string, string> = {
  html: "jsp-jstl",
};

export async function generateStaticParams() {
  const notes = getAllNotesSync();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = NOTE_ALIASES[slug] ?? slug;

  try {
    const { title } = await getNoteContent(resolvedSlug);
    return { title: `${title} - Dev Notes` };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = NOTE_ALIASES[slug] ?? slug;

  if (resolvedSlug !== slug) {
    redirect(`/notes/${resolvedSlug}`);
  }

  let note;
  try {
    note = await getNoteContent(resolvedSlug);
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
          <div className="flex items-center gap-2 mb-8 text-xs font-mono text-zinc-600">
            <Link href="/" className="flex items-center gap-1 hover:text-zinc-400 transition-colors">
              <ChevronLeft size={13} />
              notes
            </Link>
            <span>/</span>
            <span className="text-zinc-500">{slug}</span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-zinc-800/60">
                <TechIcon slug={resolvedSlug} size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 leading-tight tracking-tight">
                {note.title}
              </h1>
            </div>
            <div className="h-px bg-linear-to-r from-emerald-400/30 via-zinc-700 to-transparent mt-6" />
          </div>

          <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </PageTransition>
    </>
  );
}
