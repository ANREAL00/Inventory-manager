const categories = ['Equipment', 'Furniture', 'Book', 'Other'];

export function CategoryImageStep({ data, update }) {
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold">Category</label>
                <select
                    value={data.category}
                    onChange={(e) => update({ category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold">Illustration URL</label>
                <input
                    value={data.imageUrl}
                    onChange={(e) => update({ imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                    placeholder="Cloudinary link or direct URL"
                />
            </div>
        </div>
    );
}
