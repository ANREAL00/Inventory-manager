const prisma = require('../db');

exports.getComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            where: { inventoryId: req.params.id },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'asc' }
        });
        res.json({ comments });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await prisma.comment.create({
            data: { content, inventoryId: req.params.id, userId: req.user.id },
            include: { user: { select: { name: true } } }
        });
        const io = req.app.get('io');
        if (io) io.to(req.params.id).emit('new_comment', comment);
        res.status(201).json({ comment });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create comment' });
    }
};
