import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { X, LifeBuoy } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';

const PRIORITIES = ['High', 'Average', 'Low'];

export function SupportTicketModal({ open, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const invMatch = useMatch('/inventories/:id');
  const inventoryId = invMatch?.params?.id;

  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Average');
  const [adminEmails, setAdminEmails] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [cloudOk, setCloudOk] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      setPageUrl(typeof window !== 'undefined' ? window.location.href : '');
      setError('');
      setSuccess('');
    }
  }, [open]);

  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;
    api
      .get('/support/config')
      .then(({ data }) => {
        if (!cancelled) setCloudOk(!!data?.data?.configured);
      })
      .catch(() => {
        if (!cancelled) setCloudOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user) {
      setError(t('support_need_login'));
      return;
    }
    if (!summary.trim()) {
      setError(t('support_err_summary'));
      return;
    }
    if (!adminEmails.trim()) {
      setError(t('support_err_emails'));
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/support/tickets', {
        summary: summary.trim(),
        priority,
        pageUrl: pageUrl || window.location.href,
        adminEmails,
        inventoryId: inventoryId || undefined,
      });
      if (data?.status === 'success') {
        setSuccess(t('support_success', { file: data.data?.fileName || '' }));
        setSummary('');
        setAdminEmails('');
        setPriority('Average');
      } else {
        setError(data?.message || t('support_err_generic'));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || t('support_err_generic'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 font-semibold">
            <LifeBuoy className="text-blue-500" size={22} />
            {t('support_modal_title')}
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {!user && (
            <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-lg p-3">
              {t('support_need_login')}{' '}
              <button type="button" className="text-blue-600 underline" onClick={() => { onClose(); navigate('/login'); }}>
                {t('login')}
              </button>
            </p>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">{t('support_summary')}</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-300 min-h-[100px]"
              placeholder={t('support_summary_ph')}
              required
              disabled={!user}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('support_priority')}</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              disabled={!user}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {t(`support_prio_${p.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('support_admin_emails')}</label>
            <textarea
              value={adminEmails}
              onChange={(e) => setAdminEmails(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-300 min-h-[72px]"
              placeholder={t('support_admin_emails_ph')}
              disabled={!user}
            />
            <p className="text-xs text-gray-500 mt-1">{t('support_admin_emails_hint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('support_page_link')}</label>
            <input
              type="url"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
              readOnly={false}
              disabled={!user}
            />
            {inventoryId && (
              <p className="text-xs text-gray-500 mt-1">{t('support_inventory_context')}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
              {t('support_cancel')}
            </button>
            <button
              type="submit"
              disabled={!user || submitting || cloudOk === false}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? t('support_submitting') : t('support_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
