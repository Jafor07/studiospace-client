import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

// CHALLENGE 1 (JWT + HTTPOnly cookie):
// The browser only holds BetterAuth's HTTPOnly session cookie, which
// JavaScript cannot read. This route turns that cookie into a short-lived
// JWT on the server and forwards the request to Express with it.
// No cookie -> no token -> 401, and Express is never called.
async function forward(request, { params }) {
  const { path } = await params;

  let token = null;
  try {
    const result = await auth.api.getToken({ headers: request.headers });
    token = result?.token ?? null;
  } catch {
    token = null;
  }

  if (!token) {
    return NextResponse.json(
      { message: "Please log in to continue." },
      { status: 401 },
    );
  }

  const hasBody = !["GET", "HEAD", "DELETE"].includes(request.method);

  try {
    const res = await fetch(
      `${SERVER_URL}/${path.join("/")}${request.nextUrl.search}`,
      {
        method: request.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: hasBody ? await request.text() : undefined,
        cache: "no-store",
      },
    );

    return new NextResponse(await res.text(), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { message: "The StudioSpace server can't be reached right now." },
      { status: 502 },
    );
  }
}

export {
  forward as GET,
  forward as POST,
  forward as PATCH,
  forward as PUT,
  forward as DELETE,
};
