// Helper for BROWSER code. Every request goes to our own Next.js route
// (/api/server/...), which adds the JWT on the server and forwards the call to Express.
export async function apiRequest(path, { method = "GET", body } = {}) {
  try {
    const res = await fetch(`/api/server${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // the response had no JSON body
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
      message: data?.message || (res.ok ? "Done!" : "Something went wrong."),
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      message: "Can't reach StudioSpace right now. Check your connection.",
    };
  }
}
