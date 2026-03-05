import { useState, useEffect } from 'react';
import api from '../../api';
import { useTranslation } from 'react-i18next';

export function CustomIdPreview({ config = [], inventoryId }) {
    const [preview, setPreview] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (!inventoryId || !config.length) return setPreview('');
        const timer = setTimeout(async () => {
            try {
                const res = await api.post(`/inventories/${inventoryId}/generate-id`, { config });
                setPreview(res.data.data.customId);
            } catch (e) { setPreview(t('error_gen_id')); }
        }, 500);
        return () => clearTimeout(timer);
    }, [config, inventoryId, t]);

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t('id_preview')}</p>
            <div className="text-2xl font-mono tracking-wider text-blue-600 dark:text-blue-400 break-all">
                {preview || <span className="text-gray-400">{t('loading_preview')}</span>}
            </div>
        </div>
    );
}
