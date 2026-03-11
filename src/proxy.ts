import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOwnerSecret } from "@/lib/owner-auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isNoteMutation = pathname.startsWith("/api/notes") && req.method !== "GET";
  const isStudyTaskMutation = pathname.startsWith("/api/study-tasks") && req.method !== "GET";

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || isNoteMutation || isStudyTaskMutation) {
    const token = req.cookies.get("admin_token")?.value;
    const expected = getOwnerSecret();

    if (!token || token !== expected) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/notes", "/api/notes/:path*", "/api/study-tasks", "/api/study-tasks/:path*"],
};
