const prisma = require('../db');
const { uploadSupportJson, isConfigured, getProvider } = require('../services/supportCloudUpload');
const crypto = require('crypto');

const PRIORITIES = new Set(['High', 'Average', 'Low']);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseAdminEmails(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((e) => String(e).trim()).filter(Boolean);
  }
  return String(input)
    .split(/[,;\n]+/)
    .map((e) => e.trim())
    .filter(Boolean);
}

async function canUserReferenceInventory(user, inventoryId) {
  const inv = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!inv) return { ok: false, inventory: null };
  if (user.role === 'ADMIN') return { ok: true, inventory: inv };
  if (inv.ownerId === user.id) return { ok: true, inventory: inv };
  if (inv.isPublic) return { ok: true, inventory: inv };
  const shared = await prisma.inventory.findFirst({
    where: { id: inventoryId, authorizedUsers: { some: { id: user.id } } },
  });
  if (shared) return { ok: true, inventory: inv };
  return { ok: false, inventory: null };
}

exports.createSupportTicket = async (req, res) => {
  try {
    if (!isConfigured()) {
      return res.status(503).json({
        status: 'error',
        message:
          'Support cloud upload is not configured. Set DROPBOX_ACCESS_TOKEN or OneDrive Graph variables (see docs/POWER_AUTOMATE.md).',
      });
    }

    const { summary, priority, pageUrl, adminEmails, inventoryId } = req.body || {};
    const user = req.user;

    if (!summary || typeof summary !== 'string' || !summary.trim()) {
      return res.status(400).json({ status: 'error', message: 'Summary is required' });
    }
    if (!priority || !PRIORITIES.has(priority)) {
      return res.status(400).json({
        status: 'error',
        message: 'Priority must be one of: High, Average, Low',
      });
    }
    if (!pageUrl || typeof pageUrl !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Page link (pageUrl) is required' });
    }

    const emails = parseAdminEmails(adminEmails);
    if (emails.length === 0) {
      return res.status(400).json({ status: 'error', message: 'At least one admin email is required' });
    }
    const invalid = emails.filter((e) => !emailRegex.test(e));
    if (invalid.length) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid email(s): ${invalid.join(', ')}`,
      });
    }

    let inventoryTitle = null;
    if (inventoryId && typeof inventoryId === 'string') {
      const { ok, inventory } = await canUserReferenceInventory(user, inventoryId);
      if (!ok) {
        return res.status(403).json({
          status: 'error',
          message: 'You cannot attach this inventory to the ticket',
        });
      }
      inventoryTitle = inventory.title;
    }

    const reportedBy = `${user.name} <${user.email}>`;

    const payload = {
      'Reported by': reportedBy,
      Inventory: inventoryTitle,
      Link: pageUrl.trim(),
      Summary: summary.trim(),
      Priority: priority,
      'Admin emails': emails,
      'Created at': new Date().toISOString(),
    };

    const jsonBody = JSON.stringify(payload, null, 2);
    const fileBuffer = Buffer.from(jsonBody, 'utf8');
    const fileName = `support-ticket-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.json`;

    const upload = await uploadSupportJson(fileBuffer, fileName);

    return res.status(201).json({
      status: 'success',
      message: 'Support ticket uploaded to cloud storage',
      data: {
        fileName,
        cloudPath: upload.path,
        cloudProvider: upload.provider,
      },
    });
  } catch (err) {
    console.error('createSupportTicket', err);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to upload support ticket',
    });
  }
};

exports.getSupportConfig = async (req, res) => {
  res.json({
    status: 'success',
    data: {
      configured: isConfigured(),
      provider: isConfigured() ? getProvider() : null,
    },
  });
};
