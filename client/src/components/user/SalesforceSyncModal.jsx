import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { Modal } from '../ui/Modal';

export function SalesforceSyncModal({ isOpen, onClose, targetUserId }) {
    const { t } = useTranslation();
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        setCompany('');
        setPhone('');
        setDescription('');
        setLoading(false);
        setError(null);
        setResult(null);
    }, [isOpen]);

    const mapBackendErrorToText = (err) => {
        const code = err?.response?.data?.errorCode;
        if (code === 'SF_DUPLICATE_CONTACT') return t('sf_err_duplicate_contact');
        if (code === 'SF_GENERIC') return t('sf_err_generic');
        return err?.response?.data?.message || t('sf_err_generic');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!targetUserId) return;

        const safeCompany = company.trim();
        const safePhone = phone.trim();
        const safeDescription = description.trim();

        if (!safeCompany) {
            setError(t('sf_err_company_required'));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await api.post(
                `/salesforce/users/${targetUserId}/create-account-contact`,
                { company: safeCompany, phone: safePhone, description: safeDescription }
            );
            setResult(res.data.data);
        } catch (err) {
            setError(mapBackendErrorToText(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('sf_modal_title')}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold">{t('sf_label_company')}</label>
                    <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-900"
                        placeholder={t('sf_placeholder_company')}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold">{t('sf_label_phone')}</label>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-900"
                        placeholder={t('sf_placeholder_phone')}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-semibold">{t('sf_label_description')}</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-900 min-h-[110px]"
                        placeholder={t('sf_placeholder_description')}
                    />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                {result && (
                    <div className="text-sm bg-green-50 border border-green-200 rounded-md p-3 text-green-900">
                        <div className="font-bold mb-1">{t('sf_success_title')}</div>
                        <div>{t('sf_account_id')}: <span className="font-mono">{result.accountId}</span></div>
                        <div>{t('sf_contact_id')}: <span className="font-mono">{result.contactId}</span></div>
                    </div>
                )}

                <button
                    disabled={loading}
                    className="w-full py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition-all disabled:bg-gray-500"
                >
                    {loading ? t('sf_btn_loading') : t('sf_btn_submit')}
                </button>
            </form>
        </Modal>
    );
}

