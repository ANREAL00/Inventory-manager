const { pickLatestApiPathSegment } = require('./versioning');

const REQUIRED_ENV = [
    'SALESFORCE_CLIENT_ID',
    'SALESFORCE_CLIENT_SECRET',
    'SALESFORCE_USERNAME',
    'SALESFORCE_PASSWORD',
    'SALESFORCE_SECURITY_TOKEN',
    'SALESFORCE_LOGIN_URL',
];

function mustEnv(name) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing env var: ${name}`);
    return value;
}

function parseJsonOrNull(text) {
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function buildHeaders({ accessToken, hasJsonBody = false } = {}) {
    const headers = { Accept: 'application/json' };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    if (hasJsonBody) headers['Content-Type'] = 'application/json';
    return headers;
}

async function requestJson(url, { method = 'GET', accessToken, body } = {}) {
    const res = await fetch(url, {
        method,
        headers: buildHeaders({ accessToken, hasJsonBody: body !== undefined }),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const parsed = parseJsonOrNull(text);

    if (!res.ok) {
        const errMsg = parsed?.message || parsed?.error || text || `HTTP ${res.status}`;
        const err = new Error(`Salesforce request failed: ${errMsg}`);
        err.status = res.status;
        err.body = parsed;
        throw err;
    }

    return parsed;
}

function buildOAuthPayload() {
    for (const name of REQUIRED_ENV) mustEnv(name);

    return {
        loginUrl: process.env.SALESFORCE_LOGIN_URL,
        form: new URLSearchParams({
            grant_type: 'password',
            client_id: process.env.SALESFORCE_CLIENT_ID,
            client_secret: process.env.SALESFORCE_CLIENT_SECRET,
            username: process.env.SALESFORCE_USERNAME,
            password: `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`,
        }),
    };
}

async function getAccessToken() {
    const { loginUrl, form } = buildOAuthPayload();

    const res = await fetch(`${loginUrl}/services/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
    });

    const text = await res.text();
    const parsed = parseJsonOrNull(text);

    if (!res.ok) {
        const errMsg = parsed?.error_description || parsed?.error || text || `HTTP ${res.status}`;
        throw new Error(`Salesforce token failed: ${errMsg}`);
    }

    const accessToken = parsed?.access_token;
    const instanceUrl = parsed?.instance_url;
    if (!accessToken || !instanceUrl) {
        throw new Error('Salesforce token response missing access_token or instance_url');
    }

    return { accessToken, instanceUrl };
}

async function getApiVersion(accessToken, instanceUrl) {
    if (process.env.SALESFORCE_API_VERSION) return process.env.SALESFORCE_API_VERSION;

    const data = await requestJson(`${instanceUrl}/services/data`, { accessToken });
    const versions = Array.isArray(data) ? data : data?.versions;
    const latest = pickLatestApiPathSegment(versions);
    if (!latest) throw new Error('Could not determine latest Salesforce API version');
    return latest;
}

async function getSession() {
    const { accessToken, instanceUrl } = await getAccessToken();
    const apiVersion = await getApiVersion(accessToken, instanceUrl);
    const apiBase = `${instanceUrl}/services/data/${apiVersion}`;
    return { accessToken, apiBase, apiVersion };
}

module.exports = {
    requestJson,
    getSession,
};

