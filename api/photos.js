/**
 * Vercel Function — Web Standard `fetch` export (required on current Vercel for /api routes).
 * GET /api/photos?folder=2024 → Cloudinary Admin API list by prefix (no per-image tags).
 */
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

    const url = new URL(request.url);
    const folder = url.searchParams.get('folder') || '';

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

    if (!folder) {
      return Response.json(
        { error: 'Missing folder query, e.g. ?folder=2024' },
        { status: 400, headers: cors },
      );
    }

    const auth = 'Basic ' + btoa(`${apiKey}:${apiSecret}`);
    const prefix = folder.endsWith('/') ? folder : `${folder}/`;
    const apiPath = `/v1_1/${cloudName}/resources/image?prefix=${encodeURIComponent(
      prefix,
    )}&type=upload&max_results=500`;

    const cloudinaryRes = await fetch(`https://api.cloudinary.com${apiPath}`, {
      headers: { Authorization: auth },
    });

    const rawText = await cloudinaryRes.text();
    let json;
    try {
      json = JSON.parse(rawText);
    } catch {
      return Response.json(
        { error: 'Invalid JSON from Cloudinary', detail: rawText.slice(0, 200) },
        { status: 502, headers: cors },
      );
    }

    if (!cloudinaryRes.ok) {
      const msg =
        (json && json.error && (json.error.message || json.error)) ||
        rawText.slice(0, 200) ||
        `Cloudinary HTTP ${cloudinaryRes.status}`;
      return Response.json({ error: String(msg) }, { status: 502, headers: cors });
    }

    const resources = json.resources || [];
    const folders = {};
    resources.forEach((r) => {
      const parts = r.public_id.split('/');
      const subfolder =
        parts.length > 2 ? parts[parts.length - 2] : 'General';
      if (!folders[subfolder]) folders[subfolder] = [];
      folders[subfolder].push(r.public_id);
    });

    return Response.json({ folders }, { status: 200, headers: cors });
  },
};
