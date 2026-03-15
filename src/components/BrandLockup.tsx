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
          "rounded-2xl border border-emerald-500/10 bg-zinc-950/40 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover:border-emerald-500/30",
          compact ? "px-4 py-2.5" : "px-6 py-4"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-400/20 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <span className="text-[14px] font-mono font-black tracking-tighter">&gt;_</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="truncate text-[17px] font-black tracking-tight text-zinc-50 transition-colors group-hover:text-white">
                dev-notes
              </span>
              {!compact && (
                <span className="hidden rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 sm:inline-block">
                  PRO
                </span>
              )}
            </div>
            <p
              className={cn(
                "truncate font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-zinc-400",
                compact ? "mt-0.5" : "mt-1.5"
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
