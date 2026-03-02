const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendResponse = (res, data) => {
    res.status(200).json({ status: 'success', data });
};

const searchInventories = async (term) => {
    return await prisma.inventory.findMany({
        where: {
            OR: [
                { title: { search: term } },
                { description: { search: term } },
                { tags: { some: { name: { contains: term } } } },
            ],
        },
        take: 10,
    });
};

const buildItemSearchQuery = (term) => ({
    OR: [
        { customId: { search: term } },
        { string1: { search: term } },
        { string2: { search: term } },
        { string3: { search: term } },
        { text1: { search: term } },
        { text2: { search: term } },
        { text3: { search: term } },
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
