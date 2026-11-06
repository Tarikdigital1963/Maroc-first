const ALLOWED_ORIGIN = "https://tarikdigital1963.github.io";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (origin !== ALLOWED_ORIGIN) return new Response("Forbidden", { status: 403 });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, origin);
    if (!env.ZAPIER_HOOK_URL || !env.TURNSTILE_SECRET) {
      return json({ ok: false, error: "Server configuration incomplete" }, 503, origin);
    }

    let data;
    try {
      const raw = await request.text();
      if (raw.length > 20000) return json({ ok: false, error: "Request too large" }, 413, origin);
      data = JSON.parse(raw);
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, origin);
    }

    const title = String(data.title || "").trim();
    const body = String(data.body || "").trim();
    const token = String(data.turnstileToken || "").trim();
    if (!title || !body || !token) {
      return json({ ok: false, error: "Missing article data or verification" }, 400, origin);
    }

    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token })
    });
    const verificationResult = await verification.json();
    if (!verificationResult.success) {
      return json({ ok: false, error: "Human verification failed" }, 403, origin);
    }

    const zapierResponse = await fetch(env.ZAPIER_HOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        body,
        category: String(data.category || ""),
        source: String(data.source || ""),
        signature: String(data.signature || ""),
        submitted_at: new Date().toISOString(),
        publication_status: "pending_manual_review"
      })
    });

    if (!zapierResponse.ok) {
      return json({ ok: false, error: "Zapier did not accept the request" }, 502, origin);
    }
    return json({ ok: true, message: "Article sent for review" }, 200, origin);
  }
};
