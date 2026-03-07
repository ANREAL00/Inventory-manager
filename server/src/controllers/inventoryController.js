const prisma = require('../db');
const { generateCustomId } = require('../services/customIdService');

const sendResponse = (res, data, message = 'Success') => {
    res.status(200).json({ status: 'success', message, data });
};

const getInventoryOrThrow = async (id) => {
    const inventory = await prisma.inventory.findUnique({
        where: { id },
        include: {
            tags: true,
            fields: { orderBy: { position: 'asc' } },
            owner: true,
            items: true,
            authorizedUsers: true
        },
    });
    if (!inventory) throw new Error('Inventory not found');
    return inventory;
};

const checkAccess = (user, inventory) => {
    if (user.role === 'ADMIN') return true;
    if (inventory.ownerId === user.id) return true;
    return false;
};

exports.createInventory = async (req, res) => {
    try {
        const { title, description, category, tags = [] } = req.body;

        const tagConnect = tags.map((name) => ({
            where: { name },
            create: { name },
        }));

        const inventory = await prisma.inventory.create({
            data: {
                title,
                description,
                category,
                ownerId: req.user.id,
                tags: { connectOrCreate: tagConnect },
                fields: { create: (req.body.fields || []).map((f, i) => ({ ...f, position: i })) },
            },
            include: { tags: true, fields: true },
        });

        sendResponse(res, { inventory }, 'Inventory created');
    } catch (err) {
        console.error('Create inventory error:', err);
        res.status(500).json({ message: 'Failed to create inventory', error: err.message });
    }
};

exports.getAllInventories = async (req, res) => {
    try {
        const inventories = await prisma.inventory.findMany({
            include: { tags: true, owner: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
        sendResponse(res, { inventories });
    } catch (err) {
        console.error('Fetch inventories error:', err);
        res.status(500).json({ message: 'Failed to fetch inventories', error: err.message });
    }
};

exports.getInventory = async (req, res) => {
    try {
        const inventory = await getInventoryOrThrow(req.params.id);
        sendResponse(res, { inventory });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const inventory = await getInventoryOrThrow(req.params.id);

        if (!checkAccess(req.user, inventory)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await prisma.inventory.delete({ where: { id: req.params.id } });
        sendResponse(res, null, 'Inventory deleted');
    } catch (err) {
        res.status(err.message === 'Access denied' ? 403 : 500).json({ message: err.message });
    }
};

exports.updateInventory = async (req, res) => {
    try {
        const inventory = await getInventoryOrThrow(req.params.id);
        if (!checkAccess(req.user, inventory)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { title, description, category, imageUrl, isPublic, customIdConfig, version, fields, authorizedUsers } = req.body;

        const updateData = { title, description, category, imageUrl, isPublic, version: { increment: 1 } };
        if (customIdConfig !== undefined) updateData.customIdConfig = typeof customIdConfig === 'string' ? customIdConfig : JSON.stringify(customIdConfig);
        if (fields) updateData.fields = { deleteMany: {}, create: fields.map(({ id, inventoryId, ...f }, i) => ({ ...f, position: i })) };
        if (authorizedUsers) updateData.authorizedUsers = { set: authorizedUsers.map(u => ({ id: u.id })) };

        const updated = await prisma.inventory.update({
            where: { id: req.params.id, version },
            data: updateData,
            include: { tags: true, fields: { orderBy: { position: 'asc' } }, authorizedUsers: true, owner: { select: { name: true } } },
        });
        sendResponse(res, { inventory: updated }, 'Inventory updated');
    } catch (err) {
        console.error('Update inventory error:', err);
        res.status(err.code === 'P2025' ? 409 : 500).json({ message: 'Conflict or update failed', error: err.message });
    }
};

exports.getMyInventories = async (req, res) => {
    try {
        const inventories = await prisma.inventory.findMany({
            where: { ownerId: req.user.id },
            include: { tags: true, owner: { select: { name: true } } },
        });
        sendResponse(res, { inventories });
    } catch (err) {
        console.error('Fetch my inventories error:', err);
        res.status(500).json({ message: 'Failed to fetch your inventories', error: err.message });
    }
};

exports.getSharedInventories = async (req, res) => {
    try {
        const inventories = await prisma.inventory.findMany({
            where: { authorizedUsers: { some: { id: req.user.id } } },
            include: { tags: true, owner: { select: { name: true } } },
        });
        sendResponse(res, { inventories });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch shared inventories' });
    }
};

exports.getPopularInventories = async (req, res) => {
    try {
        const inventories = await prisma.inventory.findMany({
            include: { tags: true, owner: { select: { name: true } }, _count: { select: { items: true } } },
            orderBy: { items: { _count: 'desc' } },
            take: 5,
        });
        sendResponse(res, { inventories });
    } catch (err) {
        console.error('Fetch popular inventories error:', err);
        res.status(500).json({ message: 'Failed to fetch popular inventories', error: err.message });
    }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany();
        sendResponse(res, { tags });
    } catch (err) {
        console.error('Fetch tags error:', err);
        res.status(500).json({ message: 'Failed to fetch tags', error: err.message });
    }
};

exports.getInventoryStats = async (req, res) => {
    try {
        const inv = await prisma.inventory.findUnique({ where: { id: req.params.id }, include: { items: true, fields: true } });
        if (!inv) return res.status(404).json({ message: 'Inventory not found' });

        const stats = { itemCount: inv.items.length, fields: [] };
        inv.fields.forEach(f => {
            const typeMap = { NUMBER: 'number', STRING: 'string' };
            if (!typeMap[f.type]) return;
            const values = inv.items.map(it => it[`${typeMap[f.type]}${f.index}`]).filter(v => v !== null && v !== undefined);
            if (f.type === 'NUMBER' && values.length) {
                stats.fields.push({ title: f.title, type: 'NUMBER', avg: values.reduce((a, b) => a + b, 0) / values.length, min: Math.min(...values), max: Math.max(...values) });
            } else if (f.type === 'STRING' && values.length) {
                const counts = values.reduce((acc, v) => ({ ...acc, [v]: (acc[v] || 0) + 1 }), {});
                const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                stats.fields.push({ title: f.title, type: 'STRING', topValue: top[0], frequency: top[1] });
            }
        });
        res.json({ stats });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};

exports.generateId = async (req, res) => {
    try {
        const inv = await prisma.inventory.findUnique({ where: { id: req.params.id } });
        if (!inv) return res.status(404).json({ message: 'Inventory not found' });

        const configToUse = req.body?.config || inv.customIdConfig;

        const customId = await generateCustomId(req.params.id, configToUse, true);
        res.json({ status: 'success', data: { customId } });
    } catch (err) {
        console.error('GENERATE ID ERROR:', err);
        res.status(500).json({ message: err.message });
    }
};
