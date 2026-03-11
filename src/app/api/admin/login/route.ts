import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOwnerPassword, getOwnerSecret } from "@/lib/owner-auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  const expectedPassword = getOwnerPassword();
  const ownerSecret = getOwnerSecret();

  if (!expectedPassword || !ownerSecret) {
    return NextResponse.json({ error: "Owner auth is not configured" }, { status: 500 });
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", ownerSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
