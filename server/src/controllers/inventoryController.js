const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendResponse = (res, data, message = 'Success') => {
    res.status(200).json({ status: 'success', message, data });
};

const getInventoryOrThrow = async (id) => {
    const inventory = await prisma.inventory.findUnique({
        where: { id },
        include: { tags: true, fields: true, owner: true, items: true },
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
            },
            include: { tags: true },
        });

        sendResponse(res, { inventory }, 'Inventory created');
    } catch (err) {
        res.status(500).json({ message: 'Failed to create inventory' });
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
        res.status(500).json({ message: 'Failed to fetch inventories' });
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

        const { tags, ...data } = req.body;
        // Note: Tag update logic would go here, simplified for now

        const updated = await prisma.inventory.update({
            where: { id: req.params.id },
            data,
            include: { tags: true },
        });
        sendResponse(res, { inventory: updated }, 'Inventory updated');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getMyInventories = async (req, res) => {
    try {
        const inventories = await prisma.inventory.findMany({
            where: { ownerId: req.user.id },
            include: { tags: true },
        });
        sendResponse(res, { inventories });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your inventories' });
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
        res.status(500).json({ message: 'Failed to fetch popular inventories' });
    }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany();
        sendResponse(res, { tags });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tags' });
    }
};
