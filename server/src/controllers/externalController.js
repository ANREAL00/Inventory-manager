const prisma = require('../db');
const { buildInventoryAggregates } = require('../services/inventoryAggregationService');

exports.getInventoryExportByToken = async (req, res) => {
    try {
        const qToken = req.query.token;
        const auth = req.headers.authorization;
        const bearer = auth && auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;
        const token = (qToken || bearer || '').trim();

        if (!token) {
            return res.status(400).json({ message: 'Missing token (query ?token= or Bearer header)' });
        }

        const inv = await prisma.inventory.findFirst({
            where: { apiToken: token },
            include: {
                fields: { orderBy: { position: 'asc' } },
                items: true,
            },
        });

        if (!inv) {
            return res.status(404).json({ message: 'Invalid token or inventory not found' });
        }

        const aggregates = buildInventoryAggregates(inv);

        const payload = {
            inventoryId: inv.id,
            title: inv.title,
            category: inv.category,
            fields: inv.fields.map((f) => ({
                title: f.title,
                type: f.type,
                index: f.index,
                position: f.position,
            })),
            aggregates,
        };

        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({ status: 'success', data: payload });
    } catch (err) {
        console.error('External export error:', err);
        return res.status(500).json({ message: 'Export failed', error: err.message });
    }
};
