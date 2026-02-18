const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generators = {
    fixed: (val) => val,
    random20bit: () => Math.floor(Math.random() * 0xFFFFF).toString(16).toUpperCase().padStart(5, '0'),
    random32bit: () => Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0'),
    random6digit: () => Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    random9digit: () => Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
    guid: () => uuidv4(),
    date: () => new Date().toISOString().split('T')[0],
};

const getNextSequence = async (inventoryId) => {
    const count = await prisma.item.count({ where: { inventoryId } });
    return (count + 1).toString();
};

const generatePart = async (part, inventoryId) => {
    if (part.type === 'sequence') {
        return await getNextSequence(inventoryId);
    }
    const generator = generators[part.type];
    return generator ? generator(part.value) : '';
};

exports.generateCustomId = async (inventoryId, configJson) => {
    if (!configJson) return uuidv4();

    try {
        const config = JSON.parse(configJson);
        const parts = await Promise.all(config.map(part => generatePart(part, inventoryId)));
        return parts.join('');
    } catch (e) {
        return uuidv4();
    }
};
