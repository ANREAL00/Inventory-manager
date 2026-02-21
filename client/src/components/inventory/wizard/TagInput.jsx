export function TagInput({ tags, onAdd, onRemove }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            onAdd(e.target.value.trim());
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold">Tags (Press Enter)</label>
            <input onKeyDown={handleKeyDown} className="w-full px-3 py-2 border rounded-md dark:bg-gray-800" placeholder="Add tag..." />
            <div className="flex flex-wrap gap-2 pt-2">
                {tags.map(t => (
                    <span key={t} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                        {t} <button onClick={() => onRemove(t)} className="hover:text-blue-900">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
}
