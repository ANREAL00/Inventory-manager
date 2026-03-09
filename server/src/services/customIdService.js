const { v4: uuidv4 } = require('uuid');
const prisma = require('../db');

const generators = {
    fixed: (val) => val,
    random20bit: () => Math.floor(Math.random() * 0xFFFFF).toString(16).toUpperCase().padStart(5, '0'),
    random32bit: () => Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0'),
    random6digit: () => Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    random9digit: () => Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
    guid: () => uuidv4(),
    date: () => new Date().toISOString().split('T')[0],
};

const getNextSequence = async (inventoryId, isPreview) => {
    const inv = await prisma.inventory.findUnique({ where: { id: inventoryId }, select: { lastSequence: true } });
    const next = (inv?.lastSequence || 0) + 1;
    if (!isPreview) await prisma.inventory.update({ where: { id: inventoryId }, data: { lastSequence: next } });
    return next;
};

const formatNumberPart = (value, padLength) => {
    const str = value.toString();
    if (!padLength || typeof padLength !== 'number' || !Number.isFinite(padLength) || padLength <= 0) {
        return str;
    }
    return str.padStart(padLength, '0');
};

const generatePart = async (part, inventoryId, isPreview) => {
    if (part.type === 'sequence') {
        const seq = await getNextSequence(inventoryId, isPreview);
        return formatNumberPart(seq, part.padLength);
    }
    const generator = generators[part.type];
    return generator ? generator(part.value) : '';
};

exports.generateCustomId = async (inventoryId, configJson, isPreview = false) => {
    if (!configJson) return uuidv4();

    try {
        const config = typeof configJson === 'string' ? JSON.parse(configJson) : configJson;
        const parts = await Promise.all(config.map(part => generatePart(part, inventoryId, isPreview)));
        return parts.join('');
    } catch (e) {
        return uuidv4();
    }
};
