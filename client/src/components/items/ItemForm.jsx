import { useState } from 'react';
import { FieldInputRender } from './FieldInputRender';
import { useTranslation } from 'react-i18next';

const getInitialData = (fields) => {
    const initial = {};
    const typeMap = { STRING: 'string', TEXT: 'text', NUMBER: 'number', BOOLEAN: 'bool', DATE: 'date', IMAGE: 'image' };
    fields.forEach(f => initial[`${typeMap[f.type]}${f.index}`] = f.type === 'BOOLEAN' ? false : '');
    return initial;
};

export function ItemForm({ fields, customIdConfig = [], onSubmit, initialData = {}, readOnly = false }) {
    const [data, setData] = useState({ customId: '', ...getInitialData(fields), ...initialData });
    const { t } = useTranslation();

    const config = Array.isArray(customIdConfig) ? customIdConfig : (JSON.parse(customIdConfig || '[]'));
    const formatHint = config.map(p => {
        if (p.type === 'fixed') return p.value;
        if (p.type === 'date') return 'YYYY-MM-DD';
        if (p.type === 'guid') return 'GUID';
        if (p.type.includes('random')) return '####';
        if (p.type === 'sequence') return 'SEQ';
        return '';
    }).join('-');

    const handleChange = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    if (!fields?.length) return <div className="p-4 text-center text-gray-500 border rounded-lg">{t('no_custom_fields')}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {initialData.id && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium">{t('custom_id')}</label>
                        <input
                            value={data.customId || ''}
                            onChange={(e) => !readOnly && handleChange('customId', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 font-mono"
                            placeholder={t('placeholder_id_format', { format: formatHint })}
                            required
                        />
                        <p className="text-[10px] text-gray-400 font-mono uppercase">{t('placeholder_id_format', { format: formatHint })}</p>
                    </div>
                )}
                {fields.map(f => {
                    const typeMap = { STRING: 'string', TEXT: 'text', NUMBER: 'number', BOOLEAN: 'bool', DATE: 'date', IMAGE: 'image' };
                    const key = `${typeMap[f.type]}${f.index}`;
                    return <FieldInputRender key={f.id} field={f} value={data[key]} onChange={(val) => !readOnly && handleChange(key, val)} />;
                })}
            </div>
            {!readOnly && (
                <button className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                    {t('save_item')}
                </button>
            )}
        </form>
    );
}
