import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api';

export function OdooApiTokenPanel({ inventoryId }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [exportUrl, setExportUrl] = useState(null);
    const [error, setError] = useState(null);

    const generate = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post(`/inventories/${inventoryId}/api-token`);
            setToken(data.data.apiToken);
            setExportUrl(data.data.exportUrl);
        } catch (e) {
            setError(e.response?.data?.message || t('odoo_token_error'));
        } finally {
            setLoading(false);
        }
    };

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-900/40">
            <div>
                <h3 className="text-lg font-bold">{t('odoo_api_title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('odoo_api_desc')}</p>
            </div>
            <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-500 text-sm font-semibold"
            >
                {loading ? t('odoo_token_generating') : t('odoo_token_generate')}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {token && (
                <div className="space-y-2 text-sm">
                    <div>
                        <span className="font-semibold">{t('odoo_token_label')}</span>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <code className="flex-1 min-w-0 break-all p-2 bg-white dark:bg-gray-950 border rounded text-xs">{token}</code>
                            <button type="button" onClick={() => copy(token)} className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
                                {t('odoo_copy')}
                            </button>
                        </div>
                    </div>
                    {exportUrl && (
                        <div>
                            <span className="font-semibold">{t('odoo_export_url_label')}</span>
                            <div className="flex gap-2 mt-1 flex-wrap">
                                <code className="flex-1 min-w-0 break-all p-2 bg-white dark:bg-gray-950 border rounded text-xs">{exportUrl}</code>
                                <button type="button" onClick={() => copy(exportUrl)} className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
                                    {t('odoo_copy')}
                                </button>
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-amber-700 dark:text-amber-400">{t('odoo_token_warning')}</p>
                </div>
            )}
        </div>
    );
}
