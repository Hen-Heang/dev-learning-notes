import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { supabase } from "./supabase";

export interface NoteMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category?: string;
  tags?: string[];
}

const NOTES_DIR = path.join(process.cwd(), "notes");

const META: Record<string, { description: string; icon: string }> = {
  java: { description: "OOP, Collections, Streams, Lambda, Lombok", icon: "java" },
  springboot: { description: "IoC/DI, MVC, REST API, Transactions", icon: "springboot" },
  mybatis: { description: "Dynamic SQL, XML Mapper, Logging", icon: "mybatis" },
  sql: { description: "SELECT, JOIN, Aggregates, Pagination", icon: "sql" },
  "jsp-jstl": { description: "Templates, Tags, Formatting", icon: "jsp-jstl" },
  jquery: { description: "DOM, AJAX patterns, Form handling", icon: "jquery" },
  projects: { description: "Full-stack project references", icon: "projects" },
  roadmap: { description: "Step-by-step Korea adaptation study plan", icon: "roadmap" },
};

function formatTitle(slug: string): string {
  const map: Record<string, string> = {
    java: "Java Core",
    springboot: "Spring Boot",
    mybatis: "MyBatis",
    sql: "SQL Fundamentals",
    "jsp-jstl": "JSP & JSTL",
    jquery: "jQuery & AJAX",
    projects: "Projects",
    roadmap: "Korea Adaptation Roadmap",
  };
  return map[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

function normalizeTags(tags: unknown): string[] {
  return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : [];
}

// Try Supabase first, fall back to markdown files.
export async function getAllNotes(): Promise<NoteMeta[]> {
  const fileNotes = getAllNotesFromFiles();
  const { data, error } = await supabase
    .from("notes")
    .select("slug, title, description, category, tags")
    .order("created_at", { ascending: true });

  if (!error && data && data.length > 0) {
    const dbNotes = data.map((note) => ({
      slug: note.slug,
      title: note.title,
      description: note.description ?? "",
      icon: META[note.slug]?.icon ?? "note",
      category: note.category ?? "",
      tags: normalizeTags(note.tags),
    }));

    const merged = new Map<string, NoteMeta>();

    for (const note of dbNotes) {
      merged.set(note.slug, note);
    }

    for (const note of fileNotes) {
      if (!merged.has(note.slug)) {
        merged.set(note.slug, note);
      }
    }

    return Array.from(merged.values());
  }

  return fileNotes;
}

// Sync: read from markdown files only.
export function getAllNotesSync(): NoteMeta[] {
  return getAllNotesFromFiles();
}

function getAllNotesFromFiles(): NoteMeta[] {
  const dirs = fs.readdirSync(NOTES_DIR).filter((dirName) => {
    const full = path.join(NOTES_DIR, dirName);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, "README.md"));
  });

  return dirs.map((slug) => {
    const filePath = path.join(NOTES_DIR, slug, "README.md");
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const meta = META[slug] ?? { description: "", icon: "note" };

    return {
      slug,
      title: (data.title as string) ?? formatTitle(slug),
      description: (data.description as string) ?? meta.description,
      icon: meta.icon,
      category: (data.category as string) ?? slug,
      tags: normalizeTags(data.tags),
    };
  });
}

// Get single note content. Try Supabase first, then fall back to file.
export async function getNoteContent(
  slug: string
): Promise<{ content: string; title: string; icon: string }> {
  const { data, error } = await supabase
    .from("notes")
    .select("content, title")
    .eq("slug", slug)
    .single();

  if (!error && data) {
    return {
      content: data.content,
      title: data.title,
      icon: META[slug]?.icon ?? "note",
    };
  }

  const filePath = path.join(NOTES_DIR, slug, "README.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data: frontmatter } = matter(raw);
  const meta = META[slug] ?? { description: "", icon: "note" };

  return {
    content,
    title: (frontmatter.title as string) ?? formatTitle(slug),
    icon: meta.icon,
  };
}
