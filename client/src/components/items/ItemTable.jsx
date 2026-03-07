import { LikeButton } from './LikeButton';
import { useTranslation } from 'react-i18next';

const getCellValue = (item, field, t) => {
    const typeMap = { STRING: 'string', TEXT: 'text', NUMBER: 'number', BOOLEAN: 'bool', DATE: 'date', IMAGE: 'image' };
    const key = `${typeMap[field.type]}${field.index}`;
    const val = item[key];
    if (field.type === 'BOOLEAN') return val ? t('yes') : t('no');
    if (field.type === 'DATE') return val ? new Date(val).toLocaleDateString() : '-';
    return val ?? '-';
};

const Header = ({ fields, t }) => (
    <thead className="bg-gray-50 dark:bg-gray-900 text-xs font-semibold uppercase text-gray-500">
        <tr className="border-b">
            <th className="p-3">{t('col_id')}</th>
            {fields.filter(f => f.isVisible).map(f => <th key={f.id} className="p-3">{f.title}</th>)}
            <th className="p-3 text-right">{t('col_likes')}</th>
        </tr>
    </thead>
);

const Row = ({ item, fields, onClick, t }) => (
    <tr onClick={() => onClick(item)} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
        <td className="p-3 font-mono text-xs">{item.customId}</td>
        {fields.filter(f => f.isVisible).map(f => (
            <td key={f.id} className="p-3">{getCellValue(item, f, t)}</td>
        ))}
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
