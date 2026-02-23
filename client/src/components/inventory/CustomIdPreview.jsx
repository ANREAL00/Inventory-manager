const mockValues = {
    fixed: (v) => v || '',
    random20bit: () => 'A1B2C',
    random32bit: () => 'DEADBEEF',
    random6digit: () => '123456',
    random9digit: () => '123456789',
    guid: () => '550e8400-e29b-41d4-a716-446655440000',
    date: () => new Date().toISOString().split('T')[0],
    sequence: () => '1'
};

export function CustomIdPreview({ config = [] }) {
    const parts = config.map(p => p.type === 'fixed' ? mockValues.fixed(p.value) : mockValues[p.type]());

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">ID Preview</p>
            <div className="text-2xl font-mono tracking-wider text-blue-600 dark:text-blue-400 break-all">
                {parts.join('') || <span className="text-gray-400">Add parts to see preview</span>}
            </div>
        </div>
    );
}
