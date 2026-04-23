/**
 * Vercel Function — Web Standard `fetch` export.
 * GET /api/photos?folder=2024
 *
 * 1) Fixed folder mode: public_id starts with "2024/" → Admin list by prefix.
 * 2) Dynamic folder mode (Media Library): public_id often has no folder path →
 *    use resources/by_asset_folder + /folders/:path for subfolders.
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

async function listUploadsByPrefix(cloudName, auth, prefixStr) {
  const all = [];
  let next_cursor = '';
  for (let page = 0; page < 20; page++) {
    const qs = new URLSearchParams({
      prefix: prefixStr,
      max_results: '500',
    });
    if (next_cursor) qs.set('next_cursor', next_cursor);

    const path = `/v1_1/${cloudName}/resources/image/upload?${qs.toString()}`;
    const { res, json, rawText } = await cloudinaryGet(cloudName, auth, path);

    if (!res.ok) {
      const msg =
        (json && json.error && (json.error.message || json.error)) ||
        rawText.slice(0, 200) ||
        `HTTP ${res.status}`;
      throw new Error(String(msg));
    }

    all.push(...(json.resources || []));
    next_cursor = json.next_cursor;
    if (!next_cursor) break;
  }
  return all;
}

async function listByAssetFolder(cloudName, auth, assetFolder) {
  const all = [];
  let next_cursor = '';
  for (let page = 0; page < 20; page++) {
    const qs = new URLSearchParams({
      asset_folder: assetFolder,
      max_results: '500',
    });
    if (next_cursor) qs.set('next_cursor', next_cursor);

    const path = `/v1_1/${cloudName}/resources/by_asset_folder?${qs.toString()}`;
    const { res, json, rawText } = await cloudinaryGet(cloudName, auth, path);

    if (!res.ok) {
      const errMsg =
        json && json.error && (json.error.message || json.error)
          ? String(json.error.message || json.error)
          : rawText.slice(0, 200);
      const err = new Error(errMsg);
      err.httpStatus = res.status;
      throw err;
    }

    all.push(...(json.resources || []));
    next_cursor = json.next_cursor;
    if (!next_cursor) break;
  }
  return all;
}

function groupByPublicIdPath(resources) {
  const folders = {};
  resources.forEach((r) => {
    const parts = r.public_id.split('/');
    const subfolder =
      parts.length > 2 ? parts[parts.length - 2] : 'General';
    if (!folders[subfolder]) folders[subfolder] = [];
    folders[subfolder].push(r.public_id);
  });
  return folders;
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
    const year = String(folder).replace(/\/+$/, '');
    const withSlash = year.endsWith('/') ? year : `${year}/`;
    const folders = {};

    try {
      // ── A) Fixed folder mode: public_id path prefix ─────────────────────
      let resources = await listUploadsByPrefix(cloudName, auth, withSlash);
      if (resources.length === 0 && withSlash !== year) {
        resources = await listUploadsByPrefix(cloudName, auth, year);
      }

      if (resources.length > 0) {
        const grouped = groupByPublicIdPath(resources);
        Object.assign(folders, grouped);
      } else {
        // ── B) Dynamic folder mode (Media Library) ───────────────────────
        try {
          const rootAssets = await listByAssetFolder(cloudName, auth, year);
          if (!folders.General) folders.General = [];
          rootAssets.forEach((r) => folders.General.push(r.public_id));

          const folderPathInUrl = year
            .split('/')
            .filter(Boolean)
            .map(encodeURIComponent)
            .join('/');
          const subPath = `/v1_1/${cloudName}/folders/${folderPathInUrl}`;
          const { res: subRes, json: subJson } = await cloudinaryGet(
            cloudName,
            auth,
            subPath,
          );

          if (subRes.ok && Array.isArray(subJson.folders)) {
            for (const sub of subJson.folders) {
              const path = sub.path || `${year}/${sub.name}`;
              const name = sub.name || path.split('/').pop() || 'folder';
              try {
                const subAssets = await listByAssetFolder(cloudName, auth, path);
                if (!folders[name]) folders[name] = [];
                subAssets.forEach((r) => folders[name].push(r.public_id));
              } catch {
                // skip unreadable subfolder
              }
            }
          } else if (!subRes.ok && subRes.status !== 404) {
            // ignore 404 "no such folder API" on very old accounts
          }
        } catch (e) {
          if (e && e.httpStatus === 400) {
            return Response.json(
              {
                error:
                  'Cloudinary rejected by_asset_folder (400). Legacy fixed-folder accounts need public_id paths like 2024/… .',
                detail: String(e.message || e),
              },
              { status: 502, headers: cors },
            );
          }
          throw e;
        }
      }

      return Response.json({ folders }, { status: 200, headers: cors });
    } catch (e) {
      return Response.json(
        { error: e && e.message ? String(e.message) : String(e) },
        { status: 502, headers: cors },
      );
    }
  },
};
