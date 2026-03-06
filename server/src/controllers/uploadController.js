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
        console.error('Upload Error:', err);
        if (req.file) {
            fs.unlink(req.file.path, () => { });
        }
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
};
