/**
 * Vercel Function — Web Standard `fetch` export.
 * GET /api/years
 *
 * Returns top-level Media Library folders that look like years (e.g. "2024").
 * Response: { years: ["2024","2023",...] }
 */
async function cloudinaryGet(cloudName, authHeader, pathAndQuery) {
  const res = await fetch(`https://api.cloudinary.com${pathAndQuery}`, {
    headers: { Authorization: authHeader },
  });
  const rawText = await res.text();
  let json;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error('Invalid JSON from Cloudinary');
  }
  return { res, json, rawText };
}

export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: cors });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return Response.json(
        {
          error:
            'Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET on Vercel.',
        },
        { status: 500, headers: cors },
      );
    }

    const auth = 'Basic ' + btoa(`${apiKey}:${apiSecret}`);

    try {
      const { res, json, rawText } = await cloudinaryGet(
        cloudName,
        auth,
        `/v1_1/${cloudName}/folders`,
      );

      if (!res.ok) {
        const msg =
          (json && json.error && (json.error.message || json.error)) ||
          rawText.slice(0, 200) ||
          `HTTP ${res.status}`;
        return Response.json({ error: String(msg) }, { status: 502, headers: cors });
      }

      const folders = Array.isArray(json.folders) ? json.folders : [];
      const years = folders
        .map((f) => String((f && (f.name || f.path)) || '').trim())
        .map((s) => s.split('/')[0])
        .filter((s) => /^\d{4}$/.test(s))
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

      return Response.json({ years }, { status: 200, headers: cors });
    } catch (e) {
      return Response.json(
        { error: e && e.message ? String(e.message) : String(e) },
        { status: 502, headers: cors },
      );
    }
  },
};

