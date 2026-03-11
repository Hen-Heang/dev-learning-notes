import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — only created when first used, not at module load time
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars are not configured");
    _client = createClient(url, key);
  }
  return _client;
}

// Public client proxy — safe to import anywhere, initialised on first call
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
});

// Server-only client — uses secret key, bypasses RLS
export function createServerClient(): SupabaseClient {
  const url       = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(url, secretKey);
}

export interface Note {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface StudyTask {
  id: string;
  title: string;
  phase: string;
  category: string;
  notes: string;
  status: "todo" | "doing" | "done";
  sort_order: number;
  created_at: string;
  updated_at: string;
}
