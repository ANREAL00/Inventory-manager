const { uploadFile } = require('../services/cloudinaryService');
const fs = require('fs');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const url = await uploadFile(req.file.path);

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });

        res.status(200).json({ status: 'success', url });
    } catch (err) {
        console.error('=== UPLOAD ERROR ===', err.message);
        console.error('Cloudinary config:', {
            cloud: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
            key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
            secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
        });
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ status: 'error', message: err.message });
    }
};
