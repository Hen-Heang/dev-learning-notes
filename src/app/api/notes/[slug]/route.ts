import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase, createServerClient } from "@/lib/supabase";

// GET /api/notes/:slug — public
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PUT /api/notes/:slug — admin only (protected by middleware)
export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { title, description, category, content, tags } = body;

    const db = createServerClient();
    const { data, error } = await db
      .from("notes")
      .update({ title, description, category, content, tags })
      .eq("slug", slug)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    revalidatePath("/");
    revalidatePath(`/notes/${slug}`);

    return NextResponse.json(data);
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

// DELETE /api/notes/:slug — admin only (protected by middleware)
export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const db = createServerClient();
    const { error } = await db.from("notes").delete().eq("slug", slug);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    revalidatePath("/");

    return NextResponse.json({ message: "Deleted successfully" });
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
