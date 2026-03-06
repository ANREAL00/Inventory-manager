import { Trash2, GripVertical, Info } from 'lucide-react';
import { CustomIdPreview } from './CustomIdPreview';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Part = ({ part, onRemove, onUpdate, index, draggedIdx, setDraggedIdx, handleDrop, t }) => {
    const labelMap = {
        fixed: t('p_fixed'),
        random20bit: t('p_random20'),
        random32bit: t('p_random32'),
        random6digit: t('p_random6'),
        random9digit: t('p_random9'),
        guid: t('p_guid'),
        date: t('p_date'),
        sequence: t('p_sequence')
    };

    return (
        <div
            draggable
            onDragStart={() => setDraggedIdx(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleDrop(index); }}
            className={`flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-950 shadow-sm transition-all group ${draggedIdx === index ? 'opacity-50' : ''}`}
        >
            <div className="cursor-move p-1 text-gray-400 hover:text-gray-600"><GripVertical size={16} /></div>
            <div className="flex-1 flex justify-between items-center">
                <span className="text-sm font-semibold">{labelMap[part.type]}</span>
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
};

const TYPES = ['fixed', 'random20bit', 'random32bit', 'random6digit', 'random9digit', 'guid', 'date', 'sequence'];

export function CustomIdConfig({ config = [], inventoryId, onChange }) {
    const [draggedIdx, setDraggedIdx] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const { t } = useTranslation();

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

    const helpItems = [
        { id: 'fixed', label: t('p_fixed'), desc: t('help_fixed_desc') },
        { id: 'random20bit', label: t('p_random20'), desc: t('help_random_desc') },
        { id: 'random32bit', label: t('p_random32'), desc: t('help_random_desc') },
        { id: 'random6digit', label: t('p_random6'), desc: t('help_random_desc') },
        { id: 'random9digit', label: t('p_random9'), desc: t('help_random_desc') },
        { id: 'guid', label: t('p_guid'), desc: t('help_guid_desc') },
        { id: 'date', label: t('p_date'), desc: t('help_date_desc') },
        { id: 'sequence', label: t('p_sequence'), desc: t('help_sequence_desc') }
    ];

    return (
        <div className="space-y-6 max-w-2xl">
            <CustomIdPreview config={config} inventoryId={inventoryId} />

            <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 mr-4">
                    {helpItems.map(item => (
                        <button key={item.id} onClick={() => add(item.id)} className="px-3 py-1.5 text-xs border rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            {item.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowHelp(!showHelp)}
                    className={`p-2 rounded-full border transition-all ${showHelp ? 'bg-blue-600 border-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <Info size={20} />
                </button>
            </div>

            {showHelp && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl shadow-sm animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <Info size={16} /> {t('help_id_title')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {helpItems.map(item => (
                            <div key={item.id} className="text-xs">
                                <span className="font-bold text-blue-700 dark:text-blue-400">{item.label}:</span>
                                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {config.map((p, i) => (
                    <Part key={i} part={p} index={i} onRemove={remove} onUpdate={update} draggedIdx={draggedIdx} setDraggedIdx={setDraggedIdx} handleDrop={handleDrop} t={t} />
                ))}
            </div>
        </div>
    );
}
