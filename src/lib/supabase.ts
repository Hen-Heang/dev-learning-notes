import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client - for reads in browser + server components (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only client - uses secret key, bypasses RLS, for admin mutations
export function createServerClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(supabaseUrl, secretKey);
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
