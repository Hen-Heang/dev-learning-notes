"use client";

import { useEffect } from "react";

export function CodeCopy() {
  useEffect(() => {
    // Target both shiki wrappers and plain pre blocks
    const blocks = document.querySelectorAll<HTMLElement>("article .shiki-wrapper, article pre:not(.shiki-wrapper pre)");

    blocks.forEach((pre) => {
      // avoid duplicates
      if (pre.querySelector(".copy-btn")) return;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 11px;
        font-family: system-ui, sans-serif;
        padding: 3px 10px;
        background: #27272a;
        color: #a1a1aa;
        border: 1px solid #3f3f46;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        z-index: 10;
      `;

      btn.addEventListener("mouseenter", () => {
        btn.style.background = "#3f3f46";
        btn.style.color = "#e4e4e7";
      });
      btn.addEventListener("mouseleave", () => {
        if (btn.textContent !== "Copied!") {
          btn.style.background = "#27272a";
          btn.style.color = "#a1a1aa";
        }
      });

      btn.addEventListener("click", () => {
        const code = pre.querySelector("code")?.innerText ?? pre.innerText ?? "";
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "Copied!";
          btn.style.background = "#052e16";
          btn.style.color = "#34d399";
          btn.style.borderColor = "#34d399";
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.style.background = "#27272a";
            btn.style.color = "#a1a1aa";
            btn.style.borderColor = "#3f3f46";
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }, []);

  return null;
}
