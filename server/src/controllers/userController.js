const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserOrThrow = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
};

const sendResponse = (res, data, message = 'Success') => {
    res.status(200).json({ status: 'success', message, data });
};

const updateUserData = async (res, id, data, msg) => {
    try {
        await getUserOrThrow(id);
        const updated = await prisma.user.update({
            where: { id },
            data,
        });
        sendResponse(res, { user: updated }, msg);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        });
        sendResponse(res, { users });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

exports.blockUser = async (req, res) => {
    await updateUserData(res, req.params.id, { status: 'BLOCKED' }, 'User blocked');
};

exports.unblockUser = async (req, res) => {
    await updateUserData(res, req.params.id, { status: 'ACTIVE' }, 'User unblocked');
};

exports.deleteUser = async (req, res) => {
    try {
        await getUserOrThrow(req.params.id);
        await prisma.user.delete({ where: { id: req.params.id } });
        sendResponse(res, null, 'User deleted');
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

exports.changeRole = async (req, res) => {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    await updateUserData(res, req.params.id, { role }, 'Role updated');
};
