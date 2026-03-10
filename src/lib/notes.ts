import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface NoteMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

const NOTES_DIR = path.join(process.cwd(), "notes");

const META: Record<string, { description: string; icon: string }> = {
  java:       { description: "OOP, Collections, Streams, Lambda, Lombok", icon: "☕" },
  springboot: { description: "IoC/DI, MVC, REST API, Transactions", icon: "🌱" },
  mybatis:    { description: "Dynamic SQL, XML Mapper, Logging", icon: "🧮" },
  sql:        { description: "SELECT, JOIN, Aggregates, Pagination", icon: "🗃️" },
  "jsp-jstl": { description: "Templates, Tags, Formatting", icon: "📄" },
  jquery:     { description: "DOM, AJAX patterns, Form handling", icon: "⚡" },
  projects:   { description: "Full-stack project references", icon: "🚀" },
};

export function getAllNotes(): NoteMeta[] {
  const dirs = fs.readdirSync(NOTES_DIR).filter((d) => {
    const full = path.join(NOTES_DIR, d);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, "README.md"));
  });

  return dirs.map((slug) => {
    const filePath = path.join(NOTES_DIR, slug, "README.md");
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const meta = META[slug] ?? { description: "", icon: "📝" };

    return {
      slug,
      title: (data.title as string) ?? formatTitle(slug),
      description: (data.description as string) ?? meta.description,
      icon: meta.icon,
    };
  });
}

export function getNoteContent(slug: string): { content: string; title: string; icon: string } {
  const filePath = path.join(NOTES_DIR, slug, "README.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);
  const meta = META[slug] ?? { description: "", icon: "📝" };

  return {
    content,
    title: (data.title as string) ?? formatTitle(slug),
    icon: meta.icon,
  };
}

function formatTitle(slug: string): string {
  const map: Record<string, string> = {
    java:       "Java Core",
    springboot: "Spring Boot",
    mybatis:    "MyBatis",
    sql:        "SQL Fundamentals",
    "jsp-jstl": "JSP & JSTL",
    jquery:     "jQuery & AJAX",
    projects:   "Projects",
  };
  return map[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}
