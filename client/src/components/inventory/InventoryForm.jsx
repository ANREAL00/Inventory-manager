import { useState } from 'react';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { CategoryImageStep } from './wizard/CategoryImageStep';
import { TagInput } from './wizard/TagInput';

export function InventoryForm({ onSubmit, loading, initialData = {} }) {
    const [data, setData] = useState({
        title: '', description: '', category: 'Equipment', tags: [], imageUrl: '', ...initialData
    });

    const update = (fields) => setData(prev => ({ ...prev, ...fields }));

    const addTag = (tag) => !data.tags.includes(tag) && update({ tags: [...data.tags, tag] });
    const removeTag = (tag) => update({ tags: data.tags.filter(t => t !== tag) });

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="max-w-xl mx-auto space-y-8 p-6 border rounded-xl shadow-sm bg-white dark:bg-gray-950">
            <BasicInfoStep data={data} update={update} />
            <CategoryImageStep data={data} update={update} />
            <TagInput tags={data.tags} onAdd={addTag} onRemove={removeTag} />
            <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
                {loading ? 'Processing...' : 'Save Inventory'}
            </button>
        </form>
    );
}
