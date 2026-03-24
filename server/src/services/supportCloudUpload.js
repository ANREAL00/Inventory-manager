function getProvider() {
  return (process.env.SUPPORT_CLOUD_PROVIDER || 'dropbox').toLowerCase();
}

async function uploadSupportJson(fileBuffer, fileName) {
  const provider = getProvider();
  if (provider === 'onedrive' || provider === 'microsoft') {
    return uploadOneDrive(fileBuffer, fileName);
  }
  return uploadDropbox(fileBuffer, fileName);
}

async function uploadDropbox(fileBuffer, fileName) {
  const token = process.env.DROPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error('DROPBOX_ACCESS_TOKEN is not set');
  }
  const folder = (process.env.DROPBOX_SUPPORT_FOLDER || '/support-tickets').replace(/\/$/, '');
  const dropboxPath = `${folder}/${fileName}`.replace(/\/+/g, '/');
  if (!dropboxPath.startsWith('/')) {
    throw new Error('DROPBOX_SUPPORT_FOLDER must start with /');
  }

  const arg = {
    path: dropboxPath,
    mode: 'add',
    autorename: true,
    mute: false,
    strict_conflict: false,
  };

  const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify(arg),
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dropbox upload failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return { provider: 'dropbox', path: data.path_display || dropboxPath, id: data.id };
}

async function uploadOneDrive(fileBuffer, fileName) {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const userUpn = process.env.ONEDRIVE_USER_UPN;
  const subPath = (process.env.ONEDRIVE_SUPPORT_SUBPATH || 'SupportTickets').replace(/^\/+|\/+$/g, '');

  if (!tenantId || !clientId || !clientSecret || !userUpn) {
    throw new Error(
      'OneDrive upload requires MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, ONEDRIVE_USER_UPN'
    );
  }

  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    }
  );
  if (!tokenRes.ok) {
    const t = await tokenRes.text();
    throw new Error(`Microsoft token failed (${tokenRes.status}): ${t}`);
  }
  const { access_token: accessToken } = await tokenRes.json();

  const graphPath = `/users/${encodeURIComponent(userUpn)}/drive/root:/${encodeURIComponent(subPath)}/${encodeURIComponent(fileName)}:/content`;
  const putRes = await fetch(`https://graph.microsoft.com/v1.0${graphPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: fileBuffer,
  });
  if (!putRes.ok) {
    const t = await putRes.text();
    throw new Error(`OneDrive upload failed (${putRes.status}): ${t}`);
  }
  const data = await putRes.json();
  return { provider: 'onedrive', path: data.webUrl || graphPath, id: data.id };
}

function isConfigured() {
  const p = getProvider();
  if (p === 'onedrive' || p === 'microsoft') {
    return !!(
      process.env.MICROSOFT_TENANT_ID &&
      process.env.MICROSOFT_CLIENT_ID &&
      process.env.MICROSOFT_CLIENT_SECRET &&
      process.env.ONEDRIVE_USER_UPN
    );
  }
  return !!process.env.DROPBOX_ACCESS_TOKEN;
}

module.exports = { uploadSupportJson, isConfigured, getProvider };
