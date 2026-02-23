const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getComments = async (req, res) => {
    const comments = await prisma.comment.findMany({
        where: { inventoryId: req.params.id },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'asc' }
    });
    res.json({ comments });
};

exports.createComment = async (req, res) => {
    const { content } = req.body;
    const comment = await prisma.comment.create({
        data: { content, inventoryId: req.params.id, userId: req.user.id },
        include: { user: { select: { name: true } } }
    });
    req.app.get('io').to(req.params.id).emit('new_comment', comment);
    res.status(201).json({ comment });
};
