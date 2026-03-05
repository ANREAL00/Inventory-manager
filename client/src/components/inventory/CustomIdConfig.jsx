import { Trash2, GripVertical, Info } from 'lucide-react';
import { CustomIdPreview } from './CustomIdPreview';
import { useState } from 'react';

const Part = ({ part, onRemove, onUpdate, index, draggedIdx, setDraggedIdx, handleDrop }) => (
    <div
        draggable
        onDragStart={() => setDraggedIdx(index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleDrop(index); }}
        className={`flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-900 shadow-sm transition-all group ${draggedIdx === index ? 'opacity-50' : ''}`}
    >
        <div className="cursor-move p-1 text-gray-400 hover:text-gray-600"><GripVertical size={16} /></div>
        <div className="flex-1 flex justify-between items-center">
            <span className="text-sm font-semibold">{part.type.toUpperCase().replace('BIT', '-BIT')}</span>
            {part.type === 'fixed' && (
                <input
                    value={part.value || ''}
                    onChange={(e) => onUpdate(index, { value: e.target.value })}
                    className="ml-2 text-sm bg-transparent border-b border-dashed focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                />
            )}
        </div>
        <button onClick={() => onRemove(index)} className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded">
            <Trash2 size={16} />
        </button>
    </div>
);

const TYPES = ['fixed', 'random20bit', 'random32bit', 'random6digit', 'random9digit', 'guid', 'date', 'sequence'];

export function CustomIdConfig({ config = [], inventoryId, onChange }) {
    const [draggedIdx, setDraggedIdx] = useState(null);

    const handleDrop = (dropIdx) => {
        if (draggedIdx === null || draggedIdx === dropIdx) return;
        const newConfig = [...config];
        const [draggedItem] = newConfig.splice(draggedIdx, 1);
        newConfig.splice(dropIdx, 0, draggedItem);
        onChange(newConfig);
        setDraggedIdx(null);
    };

    const add = (type) => onChange([...config, { type, value: type === 'fixed' ? '' : undefined }]);
    const remove = (idx) => onChange(config.filter((_, i) => i !== idx));
    const update = (idx, u) => onChange(config.map((p, i) => i === idx ? { ...p, ...u } : p));

    return (
        <div className="space-y-6 max-w-2xl">
            <CustomIdPreview config={config} inventoryId={inventoryId} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map(t => <button key={t} onClick={() => add(t)} className="px-3 py-1.5 text-xs border rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">{t}</button>)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p>Drag parts to reorder. <strong>Fixed</strong>: Custom text. <strong>Random</strong>: Unique numbers. <strong>Sequence</strong>: Auto-incrementing ID. <strong>GUID</strong>: Globally unique long ID.</p>
            </div>
            <div className="space-y-2">{config.map((p, i) => <Part key={i} part={p} index={i} onRemove={remove} onUpdate={update} draggedIdx={draggedIdx} setDraggedIdx={setDraggedIdx} handleDrop={handleDrop} />)}</div>
        </div>
    );
}
