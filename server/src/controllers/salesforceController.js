const prisma = require('../db');
const { salesforceCreateAccountAndContact } = require('../services/salesforceService');

function parseDuplicateSalesforceError(body) {
    if (!Array.isArray(body)) return null;
    const duplicate = body.find((e) => e?.errorCode === 'DUPLICATES_DETECTED');
    if (!duplicate) return null;

    const firstMatchId =
        duplicate?.duplicateResult?.matchResults?.[0]?.matchRecords?.[0]?.record?.Id || null;

    return {
        message: 'Contact already exists in Salesforce',
        errorCode: 'SF_DUPLICATE_CONTACT',
        existingContactId: firstMatchId,
    };
}

exports.createAccountAndContact = async (req, res) => {
    const targetUserId = req.params.id;
    const actingUser = req.user;

    if (!actingUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (actingUser.role !== 'ADMIN' && actingUser.id !== targetUserId) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { company, phone, description } = req.body || {};
    if (!company || !String(company).trim()) {
        return res.status(400).json({ message: 'Company is required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, name: true, email: true },
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const result = await salesforceCreateAccountAndContact({
            user,
            company: String(company).trim(),
            phone: phone ? String(phone).trim() : '',
            description: description ? String(description).trim() : '',
        });

        res.status(200).json({
            status: 'success',
            message: 'Salesforce Account + Contact created',
            data: result,
        });
    } catch (err) {
        const duplicate = parseDuplicateSalesforceError(err?.body);
        if (duplicate) {
            return res.status(409).json({
                status: 'error',
                message: duplicate.message,
                errorCode: duplicate.errorCode,
                data: { existingContactId: duplicate.existingContactId },
            });
        }

        const message = err?.message || 'Failed to create Salesforce records';
        res.status(500).json({
            status: 'error',
            message,
            errorCode: 'SF_GENERIC',
            details: err?.body || undefined,
        });
    }
};

