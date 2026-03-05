import { useTranslation } from 'react-i18next';

const categories = ['Equipment', 'Furniture', 'Book', 'Other'];

export function CategoryImageStep({ data, update }) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold">{t('label_category')}</label>
                <select
                    value={data.category || ''}
                    onChange={(e) => update({ category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                >
                    {categories.map(c => (
                        <option key={c} value={c}>
                            {t(`cat_${c.toLowerCase()}`)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold">{t('label_illustration')}</label>
                <input
                    value={data.imageUrl || ''}
                    onChange={(e) => update({ imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                    placeholder={t('placeholder_illustration')}
                />
            </div>
        </div>
    );
}
