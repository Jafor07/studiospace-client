import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

// Runs before every private page below. A visitor without a session is sent
// to /login and brought back to the page they wanted after logging in.
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio",
    "/my-listings",
    "/my-bookings",
    "/studios/edit/:path*",
  ],
};
