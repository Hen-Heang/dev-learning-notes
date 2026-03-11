import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase, createServerClient } from "@/lib/supabase";
import { getAllNotesSync } from "@/lib/notes";

// GET /api/notes — public, list all notes
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("id, slug, title, description, category, tags, created_at, updated_at")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    const fallbackNotes = getAllNotesSync().map((note) => ({
      id: note.slug,
      slug: note.slug,
      title: note.title,
      description: note.description,
      category: note.category ?? "",
      tags: note.tags ?? [],
      created_at: "",
      updated_at: "",
    }));

    return NextResponse.json(fallbackNotes, {
      headers: {
        "x-notes-source": "filesystem-fallback",
      },
    });
  }
}

// POST /api/notes — admin only (protected by middleware)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, title, description, category, content, tags } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "slug, title, and content are required" }, { status: 400 });
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("notes")
      .insert({ slug, title, description, category, content, tags: tags ?? [] })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");
    revalidatePath(`/notes/${slug}`);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("fetch failed")
        ? "Supabase connection failed. If you are behind a proxy with certificate interception, restart the dev server with SUPABASE_TLS_INSECURE=true in .env.local."
        : error instanceof Error
          ? error.message
          : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
