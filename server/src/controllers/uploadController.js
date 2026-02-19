const { uploadFile } = require('../services/cloudinaryService');

const sendResponse = (res, url) => {
    res.status(200).json({ status: 'success', url });
};

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const url = await uploadFile(req.file.path);
        sendResponse(res, url);
    } catch (err) {
        res.status(500).json({ message: 'List upload failed' });
    }
};
