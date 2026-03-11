import Link from "next/link";
import { cn } from "@/lib/cn";

interface BrandLockupProps {
  compact?: boolean;
  className?: string;
}

export function BrandLockup({ compact = false, className }: BrandLockupProps) {
  return (
    <Link href="/" className={cn("group block", className)}>
      <div
        className={cn(
          "rounded-2xl border border-emerald-500/14 bg-[linear-gradient(180deg,rgba(24,24,27,0.96),rgba(9,9,11,0.98))] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]",
          compact ? "px-3 py-2" : "px-4 py-3"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/8 text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.08)] transition-colors group-hover:border-emerald-300/35 group-hover:text-emerald-200">
            <span className="text-[11px] font-mono font-semibold tracking-tight">&gt;_</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="truncate text-sm font-semibold tracking-[-0.02em] text-zinc-50 transition-colors group-hover:text-white">
                dev-notes
              </span>
              {!compact && (
                <span className="hidden rounded-full border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-500 sm:inline-block">
                  lab
                </span>
              )}
            </div>
            <p
              className={cn(
                "truncate font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500",
                compact ? "mt-0.5" : "mt-1"
              )}
            >
              Korean enterprise stack
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
