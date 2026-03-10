import { createHighlighter, type Highlighter } from "shiki";
import { marked, Renderer } from "marked";

// Language aliases — map markdown fence names to shiki lang IDs
const LANG_MAP: Record<string, string> = {
  js:         "javascript",
  ts:         "typescript",
  jsx:        "jsx",
  tsx:        "tsx",
  java:       "java",
  sql:        "sql",
  xml:        "xml",
  jsp:        "html",   // JSP is close enough to HTML
  html:       "html",
  css:        "css",
  bash:       "bash",
  sh:         "bash",
  shell:      "bash",
  json:       "json",
  properties: "properties",
  yaml:       "yaml",
  text:       "text",
  txt:        "text",
};

const SUPPORTED_LANGS = [
  "javascript", "typescript", "jsx", "tsx",
  "java", "sql", "xml", "html", "css",
  "bash", "json", "properties", "yaml", "text",
];

let _highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!_highlighter) {
    _highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: SUPPORTED_LANGS,
    });
  }
  return _highlighter;
}

export async function renderMarkdown(content: string): Promise<string> {
  const highlighter = await getHighlighter();

  const renderer = new Renderer();

  renderer.code = ({ text, lang }) => {
    const rawLang = (lang ?? "").toLowerCase().trim();
    const resolvedLang = LANG_MAP[rawLang] ?? rawLang;
    const safeLang = SUPPORTED_LANGS.includes(resolvedLang) ? resolvedLang : "text";

    try {
      const html = highlighter.codeToHtml(text, {
        lang: safeLang,
        theme: "github-dark",
      });
      // Wrap so we can style / attach copy button
      return `<div class="shiki-wrapper">${html}</div>`;
    } catch {
      // Fallback plain block
      return `<pre><code>${text}</code></pre>`;
    }
  };

  return marked(content, { renderer, gfm: true, breaks: false }) as Promise<string>;
}
