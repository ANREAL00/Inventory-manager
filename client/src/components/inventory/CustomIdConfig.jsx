import { Trash2, GripVertical, Info } from 'lucide-react';
import { CustomIdPreview } from './CustomIdPreview';

const Part = ({ part, onRemove, index }) => (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-900 shadow-sm transition-all group">
        <GripVertical className="text-gray-400 cursor-move" size={16} />
        <div className="flex-1 flex justify-between items-center">
            <span className="text-sm font-semibold">{part.type.toUpperCase().replace('BIT', '-BIT')}</span>
            {part.type === 'fixed' && (
                <input
                    value={part.value || ''}
                    onChange={(e) => onRemove(index, { value: e.target.value })}
                    className="ml-2 text-sm bg-transparent border-b border-dashed focus:outline-none"
                />
            )}
        </div>
        <button onClick={() => onRemove(index)} className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded">
            <Trash2 size={16} />
        </button>
    </div>
);

const TYPES = ['fixed', 'random20bit', 'random32bit', 'random6digit', 'random9digit', 'guid', 'date', 'sequence'];

export function CustomIdConfig({ config, onChange }) {
    const add = (type) => onChange([...config, { type, value: type === 'fixed' ? '' : undefined }]);
    const remove = (idx) => onChange(config.filter((_, i) => i !== idx));
    const update = (idx, u) => onChange(config.map((p, i) => i === idx ? { ...p, ...u } : p));

    return (
        <div className="space-y-6 max-w-2xl">
            <CustomIdPreview config={config} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map(t => <button key={t} onClick={() => add(t)} className="px-3 py-1.5 text-xs border rounded-full hover:bg-gray-50">{t}</button>)}
            </div>
            <div className="space-y-2">{config.map((p, i) => <Part key={i} part={p} index={i} onRemove={update} />)}</div>
        </div>
    );
}
