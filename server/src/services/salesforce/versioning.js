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
    if (typeof item.url === 'string') {
        const m = item.url.match(/\/(v\d+\.\d+)\/?$/i);
        if (m) return m[1];
    }
    const parsed = parseVersionSegment(item.version);
    return parsed?.pathSegment || null;
}

function versionScore(versionItem) {
    const segment = apiPathSegmentFromVersionItem(versionItem);
    const parsed = parseVersionSegment(segment || versionItem?.version);
    return parsed ? parsed.major * 100 + parsed.minor : -1;
}

function pickLatestApiPathSegment(versions) {
    if (!Array.isArray(versions) || versions.length === 0) return null;

    let bestItem = versions[0];
    let bestKey = -1;
    for (const item of versions) {
        const key = versionScore(item);
        if (key > bestKey) {
            bestKey = key;
            bestItem = item;
        }
    }

    return apiPathSegmentFromVersionItem(bestItem);
}

module.exports.pickLatestApiPathSegment = pickLatestApiPathSegment;