import { useState } from 'react';
import { FieldInputRender } from './FieldInputRender';

const getInitialData = (fields) => {
    const initial = {};
    const typeMap = { STRING: 'string', TEXT: 'text', NUMBER: 'number', BOOLEAN: 'bool', DATE: 'date', IMAGE: 'image' };
    fields.forEach(f => initial[`${typeMap[f.type]}${f.index}`] = f.type === 'BOOLEAN' ? false : '');
    return initial;
};

export function ItemForm({ fields, onSubmit, initialData = {} }) {
    const [data, setData] = useState({ ...getInitialData(fields), ...initialData });

    const handleChange = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    if (!fields?.length) return <div className="p-4 text-center text-gray-500 border rounded-lg">No custom fields defined for this inventory.</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {fields.map(f => {
                    const typeMap = { STRING: 'string', TEXT: 'text', NUMBER: 'number', BOOLEAN: 'bool', DATE: 'date', IMAGE: 'image' };
                    const key = `${typeMap[f.type]}${f.index}`;
                    return <FieldInputRender key={f.id} field={f} value={data[key]} onChange={(val) => handleChange(key, val)} />;
                })}
            </div>
            <button className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                Save Item
            </button>
        </form>
    );
}
