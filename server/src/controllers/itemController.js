const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateCustomId } = require('../services/customIdService');

const sendResponse = (res, data, msg = 'Success') => {
    res.status(200).json({ status: 'success', message: msg, data });
};

const getItemOrThrow = async (id) => {
    const item = await prisma.item.findUnique({
        where: { id },
        include: { inventory: true },
    });
    if (!item) throw new Error('Item not found');
    return item;
};

const checkWriteAccess = (user, inventory) => {
    if (user.role === 'ADMIN') return true;
    if (inventory.ownerId === user.id) return true;
    return false;
};

const getInventoryConfig = async (inventoryId) => {
    const inventory = await prisma.inventory.findUnique({
        where: { id: inventoryId },
        select: { customIdConfig: true, ownerId: true },
    });
    if (!inventory) throw new Error('Inventory not found');
    return inventory;
};

const prepareItemData = (body, inventoryId, customId, userId) => ({
    ...body,
    inventoryId,
    customId,
    createdByUserId: userId,
});

const performUpdate = async (id, data) => {
    return await prisma.item.update({ where: { id }, data });
};

exports.getItem = async (req, res) => {
    try {
        const item = await getItemOrThrow(req.params.id);
        sendResponse(res, { item });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            where: { inventoryId: req.params.inventoryId },
            orderBy: { createdAt: 'desc' },
        });
        sendResponse(res, { items });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch items' });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { inventoryId } = req.body;
        const inventory = await getInventoryConfig(inventoryId);

        if (!checkWriteAccess(req.user, inventory)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const customId = await generateCustomId(inventoryId, inventory.customIdConfig);
        const data = prepareItemData(req.body, inventoryId, customId, req.user.id);

        const item = await prisma.item.create({ data });
        sendResponse(res, { item }, 'Item created');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await getItemOrThrow(req.params.id);
        if (!checkWriteAccess(req.user, item.inventory)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updated = await performUpdate(req.params.id, req.body);
        sendResponse(res, { item: updated }, 'Item updated');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await getItemOrThrow(req.params.id);
        if (!checkWriteAccess(req.user, item.inventory)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await prisma.item.delete({ where: { id: req.params.id } });
        sendResponse(res, null, 'Item deleted');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLikes = async (req, res) => {
    const likes = await prisma.like.findMany({ where: { itemId: req.params.id } });
    res.json({ likes });
};

exports.toggleLike = async (req, res) => {
    const { id: itemId } = req.params;
    const userId = req.user.id;
    const existing = await prisma.like.findUnique({ where: { itemId_userId: { itemId, userId } } });
    if (existing) { await prisma.like.delete({ where: { id: existing.id } }); }
    else { await prisma.like.create({ data: { itemId, userId } }); }
    res.status(200).json({ status: 'success' });
};
