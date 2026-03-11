import { SiSpringboot, SiJquery, SiPostgresql, SiHtml5 } from "react-icons/si";
import { FaJava, FaDatabase, FaRocket, FaLayerGroup, FaRoad } from "react-icons/fa";
import { cn } from "@/lib/cn";

interface TechIconProps {
  slug: string;
  size?: number;
  className?: string;
}

const ICON_MAP: Record<string, { icon: React.ElementType; color: string }> = {
  java:       { icon: FaJava,        color: "#f89820" },
  springboot: { icon: SiSpringboot,  color: "#6db33f" },
  mybatis:    { icon: FaDatabase,    color: "#c0392b" },
  sql:        { icon: SiPostgresql,  color: "#336791" },
  "jsp-jstl": { icon: SiHtml5,       color: "#e44d26" },
  jquery:     { icon: SiJquery,      color: "#0769ad" },
  projects:   { icon: FaRocket,      color: "#a78bfa" },
  roadmap:    { icon: FaRoad,        color: "#f59e0b" },
};

const FALLBACK = { icon: FaLayerGroup, color: "#6b7280" };

export function TechIcon({ slug, size = 22, className }: TechIconProps) {
  const { icon: Icon, color } = ICON_MAP[slug] ?? FALLBACK;
  return (
    <Icon
      size={size}
      style={{ color }}
      className={cn("shrink-0", className)}
      aria-hidden="true"
    />
  );
}

export function getTechColor(slug: string): string {
  return ICON_MAP[slug]?.color ?? FALLBACK.color;
}
