import { useState, useEffect } from 'react';
import api from '../../api';

export function CustomIdPreview({ config = [], inventoryId }) {
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (!inventoryId) return;
        const fetch = async () => {
            try {
                const res = await api.get(`/inventories/${inventoryId}/generate-id`);
                setPreview(res.data.data.customId);
            } catch (e) { setPreview('Error generating ID'); }
        };
        fetch();
    }, [config, inventoryId]);

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">ID Preview</p>
            <div className="text-2xl font-mono tracking-wider text-blue-600 dark:text-blue-400 break-all">
                {preview || <span className="text-gray-400">Loading preview...</span>}
            </div>
        </div>
    );
}
