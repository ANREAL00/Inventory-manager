export const StringInput = ({ field, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold">{field.title}</label>
        <input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            placeholder={field.description}
        />
    </div>
);

export const NumberInput = ({ field, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold">{field.title}</label>
        <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
    </div>
);

export const BoolInput = ({ field, value, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer py-2">
        <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600"
        />
        <span className="text-sm font-medium">{field.title}</span>
    </label>
);

export const DateInput = ({ field, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold">{field.title}</label>
        <input
            type="date"
            value={value ? value.split('T')[0] : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
    </div>
);
