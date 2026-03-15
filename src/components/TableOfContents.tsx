"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ html }: { html: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the rendered HTML (since we're on client side)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings = Array.from(doc.querySelectorAll("h2, h3"));
    
    const items = headings.map((h) => ({
      id: h.id || h.textContent?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") || "",
      text: h.textContent || "",
      level: parseInt(h.tagName.substring(1)),
    }));
    
    setToc(items);
  }, [html]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: "-100px 0% -80% 0%" }
    );

    const headingElements = document.querySelectorAll("h2, h3");
    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24 w-64 shrink-0 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
      <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
        <List size={14} />
        Table of Contents
      </div>
      
      <ul className="space-y-1 relative">
        {/* Active line indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-800" />
        
        {toc.map((item) => (
          <li 
            key={item.id} 
            className={cn(
              "group relative pl-4 transition-all duration-200",
              item.level === 3 ? "ml-4" : ""
            )}
          >
            {/* Indicator Dot */}
            <div className={cn(
              "absolute left-[-0.5px] top-1/2 -translate-y-1/2 w-px h-full bg-transparent group-hover:bg-zinc-700 transition-colors",
              activeId === item.id ? "bg-emerald-500 h-full w-[2px] z-10" : ""
            )} />
            
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
              }}
              className={cn(
                "block py-1.5 text-xs font-medium transition-colors hover:text-zinc-200",
                activeId === item.id ? "text-emerald-400" : "text-zinc-500"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
