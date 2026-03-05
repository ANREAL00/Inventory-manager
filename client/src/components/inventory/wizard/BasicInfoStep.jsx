import { useTranslation } from 'react-i18next';

export function BasicInfoStep({ data, update }) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold">{t('label_title')}</label>
                <input
                    value={data.title || ''}
                    onChange={(e) => update({ title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                    placeholder={t('placeholder_title')}
                    required
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold">{t('label_desc')}</label>
                <textarea
                    value={data.description || ''}
                    onChange={(e) => update({ description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 h-24"
                    placeholder={t('placeholder_desc')}
                />
            </div>
        </div>
    );
}
