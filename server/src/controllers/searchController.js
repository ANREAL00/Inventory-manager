const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendResponse = (res, data) => {
    res.status(200).json({ status: 'success', data });
};

const searchInventories = async (term) => {
    return await prisma.inventory.findMany({
        where: {
            OR: [
                { title: { contains: term } },
                { description: { contains: term } },
                { tags: { some: { name: { contains: term } } } },
            ],
        },
        take: 10,
    });
};

const buildItemSearchQuery = (term) => ({
    OR: [
        { customId: { contains: term } },
        { string1: { contains: term } },
        { string2: { contains: term } },
        { string3: { contains: term } },
        { text1: { contains: term } },
        { text2: { contains: term } },
        { text3: { contains: term } },
    ],
});

const searchItems = async (term) => {
    return await prisma.item.findMany({
        where: buildItemSearchQuery(term),
        include: { inventory: { select: { title: true } } },
        take: 10,
    });
};

exports.search = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return sendResponse(res, { inventories: [], items: [] });

        const [inventories, items] = await Promise.all([
            searchInventories(q),
            searchItems(q),
        ]);

        sendResponse(res, { inventories, items });
    } catch (err) {
        res.status(500).json({ message: 'Search failed' });
    }
};
