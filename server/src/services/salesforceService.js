const SALESFORCE_API_ENV_VARS = [
    'SALESFORCE_CLIENT_ID',
    'SALESFORCE_CLIENT_SECRET',
    'SALESFORCE_USERNAME',
    'SALESFORCE_PASSWORD',
    'SALESFORCE_SECURITY_TOKEN',
    'SALESFORCE_LOGIN_URL'
];

function mustEnv(name) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing env var: ${name}`);
    return value;
}

async function salesforceFetchJson(url, { method = 'GET', accessToken, body } = {}) {
    const headers = {
        Accept: 'application/json',
    };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let parsed = null;
    try {
        parsed = text ? JSON.parse(text) : null;
    } catch {
        parsed = null;
    }

    if (!res.ok) {
        const errMsg = parsed?.message || parsed?.error || text || `HTTP ${res.status}`;
        const err = new Error(`Salesforce request failed: ${errMsg}`);
        err.status = res.status;
        err.body = parsed;
        throw err;
    }

    return parsed;
}

async function salesforceGetAccessToken() {
    for (const name of SALESFORCE_API_ENV_VARS) mustEnv(name);

    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const username = process.env.SALESFORCE_USERNAME;
    const password = `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`;
    const loginUrl = process.env.SALESFORCE_LOGIN_URL;

    const form = new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
    });

    const res = await fetch(`${loginUrl}/services/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
    });

    const text = await res.text();
    let parsed = null;
    try {
        parsed = text ? JSON.parse(text) : null;
    } catch {
        parsed = null;
    }

    if (!res.ok) {
        const errMsg = parsed?.error_description || parsed?.error || text || `HTTP ${res.status}`;
        throw new Error(`Salesforce token failed: ${errMsg}`);
    }

    const accessToken = parsed.access_token;
    const instanceUrl = parsed.instance_url;
    if (!accessToken || !instanceUrl) {
        throw new Error('Salesforce token response missing access_token or instance_url');
    }

    return { accessToken, instanceUrl };
}

function parseVersionSegment(versionOrUrl) {
    const s = String(versionOrUrl || '').trim();
    const withV = s.match(/^v(\d+)\.(\d+)$/i);
    if (withV) return { major: Number(withV[1]), minor: Number(withV[2]), pathSegment: `v${withV[1]}.${withV[2]}` };
    const noV = s.match(/^(\d+)\.(\d+)$/);
    if (noV) return { major: Number(noV[1]), minor: Number(noV[2]), pathSegment: `v${noV[1]}.${noV[2]}` };
    return null;
}

function apiPathSegmentFromVersionItem(item) {
    if (!item) return null;
    if (item.url && typeof item.url === 'string') {
        const m = item.url.match(/\/(v\d+\.\d+)\/?$/i);
        if (m) return m[1];
    }
    const parsed = parseVersionSegment(item.version);
    return parsed?.pathSegment || null;
}

function pickLatestApiPathSegment(versions) {
    if (!Array.isArray(versions) || versions.length === 0) return null;

    let bestItem = versions[0];
    let bestKey = -1;

    for (const item of versions) {
        const seg = apiPathSegmentFromVersionItem(item);
        const parsed = parseVersionSegment(seg || item.version);
        const key = parsed ? parsed.major * 100 + parsed.minor : -1;
        if (key > bestKey) {
            bestKey = key;
            bestItem = item;
        }
    }

    return apiPathSegmentFromVersionItem(bestItem);
}

async function salesforceGetApiVersion({ accessToken, instanceUrl }) {
    if (process.env.SALESFORCE_API_VERSION) return process.env.SALESFORCE_API_VERSION;

    const data = await salesforceFetchJson(`${instanceUrl}/services/data`, { accessToken });
    const versions = Array.isArray(data) ? data : data?.versions;
    const latest = pickLatestApiPathSegment(versions);
    if (!latest) throw new Error('Could not determine latest Salesforce API version');
    return latest;
}

async function salesforceCreateAccountAndContact({ user, company, phone, description }) {
    if (!company) throw new Error('company is required');
    if (!user?.email) throw new Error('user.email is required');
    if (!user?.name) throw new Error('user.name is required');

    const { accessToken, instanceUrl } = await salesforceGetAccessToken();
    const apiVersion = await salesforceGetApiVersion({ accessToken, instanceUrl });
    const base = `${instanceUrl}/services/data/${apiVersion}`;

    const accountPayload = {
        Name: company,
    };
    if (description) accountPayload.Description = description;

    let account;
    try {
        account = await salesforceFetchJson(`${base}/sobjects/Account`, {
            method: 'POST',
            accessToken,
            body: accountPayload,
        });
    } catch (err) {
        if (description) {
            const payloadWithoutDescription = { Name: company };
            account = await salesforceFetchJson(`${base}/sobjects/Account`, {
                method: 'POST',
                accessToken,
                body: payloadWithoutDescription,
            });
        } else {
            throw err;
        }
    }

    const accountId = account?.id;
    if (!accountId) throw new Error('Salesforce Account creation failed (no id returned)');

    const parts = String(user.name).trim().split(/\s+/).filter(Boolean);
    const firstName = parts.length ? parts[0] : 'User';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : parts[0] || 'Unknown';

    const contactPayload = {
        FirstName: firstName,
        LastName: lastName,
        Email: user.email,
        AccountId: accountId,
    };
    if (phone) contactPayload.Phone = phone;

    const contact = await salesforceFetchJson(`${base}/sobjects/Contact`, {
        method: 'POST',
        accessToken,
        body: contactPayload,
    });

    const contactId = contact?.id;
    if (!contactId) throw new Error('Salesforce Contact creation failed (no id returned)');

    return { accountId, contactId, apiVersion };
}

module.exports = {
    salesforceCreateAccountAndContact,
};

