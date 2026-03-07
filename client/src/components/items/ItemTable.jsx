import { LikeButton } from './LikeButton';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const getCellValue = (item, field, t) => {
    const typeMap = { STRING: 'string', TEXT: 'text', NUMBER: 'number', BOOLEAN: 'bool', DATE: 'date', IMAGE: 'image' };
    const key = `${typeMap[field.type]}${field.index}`;
    const val = item[key];
    if (field.type === 'BOOLEAN') return val ? t('yes') : t('no');
    if (field.type === 'DATE') return val ? new Date(val).toLocaleDateString() : '-';
    if (field.type === 'IMAGE') return val;
    return val ?? '-';
};

const ImageCell = ({ url }) => {
    const [err, setErr] = useState(false);
    useEffect(() => setErr(false), [url]);
    if (!url || err) return <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded w-12 h-12 flex items-center justify-center"><ImageIcon className="text-gray-300" size={16} /></div>;
    return <img src={url} className="w-12 h-12 object-cover rounded shadow-sm" onError={() => setErr(true)} />;
};

const Header = ({ fields, t }) => (
    <thead className="bg-gray-50 dark:bg-gray-900 text-xs font-semibold uppercase text-gray-500">
        <tr className="border-b">
            {fields.filter(f => f.isVisible).map(f => <th key={f.id} className="p-3">{f.title}</th>)}
            <th className="p-3">{t('col_id')}</th>
            <th className="p-3 text-right">{t('col_likes')}</th>
        </tr>
    </thead>
);

const truncateId = (id) => (id?.length > 10 ? `${id.slice(0, 10)}...` : id);

const Row = ({ item, fields, onClick, t }) => (
    <tr onClick={() => onClick(item)} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
        {fields.filter(f => f.isVisible).map(f => (
            <td key={f.id} className="p-3">
                {f.type === 'IMAGE' ? <ImageCell url={getCellValue(item, f, t)} /> : getCellValue(item, f, t)}
            </td>
        ))}
        <td className="p-3 font-mono text-xs text-gray-400" title={item.customId}>{truncateId(item.customId)}</td>
        <td className="p-3 text-right">
            <div
                className="flex justify-end"
                onClick={(e) => e.stopPropagation()}
            >
                <LikeButton itemId={item.id} />
            </div>
        </td>
    </tr>
);

export function ItemTable({ items, fields, onItemClick }) {
    const { t } = useTranslation();

    if (!items || items.length === 0) {
        return (
            <div className="py-12 text-center border rounded-lg bg-gray-50/50 dark:bg-gray-900/20 border-dashed">
                <p className="text-gray-500 font-medium">{t('no_items')}</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <Header fields={fields} t={t} />
                <tbody>{items.map(it => <Row key={it.id} item={it} fields={fields} onClick={onItemClick} t={t} />)}</tbody>
            </table>
        </div>
    );
}
