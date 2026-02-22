const getCellValue = (item, field) => {
    const typeMap = { STRING: 'string', TEXT: 'text', NUMBER: 'number', BOOLEAN: 'bool', DATE: 'date', IMAGE: 'image' };
    const key = `${typeMap[field.type]}${field.index}`;
    const val = item[key];
    if (field.type === 'BOOLEAN') return val ? 'Yes' : 'No';
    if (field.type === 'DATE') return val ? new Date(val).toLocaleDateString() : '-';
    return val ?? '-';
};

const Header = ({ fields }) => (
    <thead className="bg-gray-50 dark:bg-gray-900 text-xs font-semibold uppercase text-gray-500">
        <tr className="border-b">
            <th className="p-3">ID</th>
            {fields.filter(f => f.isVisible).map(f => <th key={f.id} className="p-3">{f.title}</th>)}
        </tr>
    </thead>
);

const Row = ({ item, fields }) => (
    <tr className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900">
        <td className="p-3 font-mono text-xs">{item.customId}</td>
        {fields.filter(f => f.isVisible).map(f => (
            <td key={f.id} className="p-3">{getCellValue(item, f)}</td>
        ))}
    </tr>
);

export function ItemTable({ items, fields }) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <Header fields={fields} />
                <tbody>{items.map(it => <Row key={it.id} item={it} fields={fields} />)}</tbody>
            </table>
        </div>
    );
}
