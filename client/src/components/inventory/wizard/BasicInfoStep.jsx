export function BasicInfoStep({ data, update }) {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold">Title</label>
                <input
                    value={data.title}
                    onChange={(e) => update({ title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                    placeholder="e.g. My Book Collection"
                    required
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold">Description (Markdown)</label>
                <textarea
                    value={data.description}
                    onChange={(e) => update({ description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 h-24"
                    placeholder="Describe your inventory..."
                />
            </div>
        </div>
    );
}
