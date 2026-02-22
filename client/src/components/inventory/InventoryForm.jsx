import { useState } from 'react';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { CategoryImageStep } from './wizard/CategoryImageStep';
import { TagInput } from './wizard/TagInput';
import { FieldConfigurator } from './fields/FieldConfigurator';
import { useFieldConfiguration } from '../../hooks/useFieldConfiguration';

export function InventoryForm({ onSubmit, loading, initialData = {} }) {
    const [data, setData] = useState({ title: '', description: '', category: 'Equipment', tags: [], imageUrl: '', ...initialData });
    const { fields, addField, updateField, removeField } = useFieldConfiguration(initialData.fields || []);

    const update = (f) => setData(p => ({ ...p, ...f }));
    const addTag = (t) => !data.tags.includes(t) && update({ tags: [...data.tags, t] });
    const removeTag = (t) => update({ tags: data.tags.filter(tg => tg !== t) });

    const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...data, fields }); };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8 p-6 border rounded-xl shadow-sm bg-white dark:bg-gray-950">
            <BasicInfoStep data={data} update={update} />
            <CategoryImageStep data={data} update={update} />
            <TagInput tags={data.tags} onAdd={addTag} onRemove={removeTag} />
            <FieldConfigurator fields={fields} addField={addField} updateField={updateField} removeField={removeField} />
            <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
                {loading ? 'Processing...' : 'Save Inventory'}
            </button>
        </form>
    );
}
