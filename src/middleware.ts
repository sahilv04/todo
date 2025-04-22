import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Defer JWT verification to API routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/tasks/:path*"],
};
