/**
 * Vercel Function — Web Standard `fetch` export.
 * GET /api/photos?folder=2024 → Cloudinary Admin API list by public_id prefix.
 *
 * REST path must be .../resources/image/upload?prefix=... (not .../resources/image?type=upload).
 */

async function cloudinaryListAllByPrefix(cloudName, authHeader, prefixStr) {
  const all = [];
  let next_cursor = '';
  for (let page = 0; page < 20; page++) {
    const qs = new URLSearchParams({
      prefix: prefixStr,
      max_results: '500',
    });
    if (next_cursor) qs.set('next_cursor', next_cursor);

    const path = `/v1_1/${cloudName}/resources/image/upload?${qs.toString()}`;
    const cloudinaryRes = await fetch(`https://api.cloudinary.com${path}`, {
      headers: { Authorization: authHeader },
    });

    const rawText = await cloudinaryRes.text();
    let json;
    try {
      json = JSON.parse(rawText);
    } catch {
      throw new Error('Invalid JSON from Cloudinary');
    }

    if (!cloudinaryRes.ok) {
      const msg =
        (json && json.error && (json.error.message || json.error)) ||
        rawText.slice(0, 200) ||
        `Cloudinary HTTP ${cloudinaryRes.status}`;
      throw new Error(String(msg));
    }

    all.push(...(json.resources || []));
    next_cursor = json.next_cursor;
    if (!next_cursor) break;
  }
  return all;
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
    const withSlash = folder.endsWith('/') ? folder : `${folder}/`;
    const withoutSlash = String(folder).replace(/\/+$/, '');

    let resources;
    try {
      resources = await cloudinaryListAllByPrefix(cloudName, auth, withSlash);
      if (resources.length === 0 && withoutSlash !== withSlash) {
        resources = await cloudinaryListAllByPrefix(cloudName, auth, withoutSlash);
      }
    } catch (e) {
      return Response.json(
        { error: e && e.message ? String(e.message) : String(e) },
        { status: 502, headers: cors },
      );
    }

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
