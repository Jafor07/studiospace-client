import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

// Helpers for SERVER components. Browser code uses client-api.js instead.

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

// Public data. Returns { data, status }. status 0 means "server not reachable".
export async function apiGet(path) {
  try {
    const res = await fetch(`${SERVER_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return { data: null, status: res.status };
    return { data: await res.json(), status: res.status };
  } catch {
    return { data: null, status: 0 };
  }
}

// cache() makes sure the page and generateMetadata share one request
export const getStudio = cache((id) => apiGet(`/studios/${id}`));

export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

// Private data. The JWT is created here on the server from the HTTPOnly
// session cookie, so the browser never sees it.
export async function apiGetPrivate(path) {
  try {
    const result = await auth.api.getToken({ headers: await headers() });
    if (!result?.token) return { data: null, status: 401 };

    const res = await fetch(`${SERVER_URL}${path}`, {
      headers: { Authorization: `Bearer ${result.token}` },
      cache: "no-store",
    });
    if (!res.ok) return { data: null, status: res.status };
    return { data: await res.json(), status: res.status };
  } catch {
    return { data: null, status: 0 };
  }
}
