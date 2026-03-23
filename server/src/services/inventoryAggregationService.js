function buildInventoryAggregates(inv) {
    if (!inv?.fields || !inv?.items) {
        return { itemCount: 0, fields: [] };
    }

    const stats = { itemCount: inv.items.length, fields: [] };

    const typeToPrefix = {
        NUMBER: 'number',
        STRING: 'string',
        TEXT: 'text',
    };

    inv.fields.forEach((f) => {
        const prefix = typeToPrefix[f.type];
        if (!prefix) return;

        const key = `${prefix}${f.index}`;
        const values = inv.items.map((it) => it[key]).filter((v) => v !== null && v !== undefined);

        if (f.type === 'NUMBER' && values.length) {
            stats.fields.push({
                title: f.title,
                type: 'NUMBER',
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
            });
        } else if ((f.type === 'STRING' || f.type === 'TEXT') && values.length) {
            const strValues = values.map((v) => String(v));
            const counts = strValues.reduce((acc, v) => ({ ...acc, [v]: (acc[v] || 0) + 1 }), {});
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            const top = sorted.slice(0, 5).map(([value, count]) => ({ value, count }));
            stats.fields.push({
                title: f.title,
                type: f.type,
                topValues: top,
                topValue: top[0].value,
                frequency: top[0].count,
            });
        }
    });

    return stats;
}

module.exports = { buildInventoryAggregates };
