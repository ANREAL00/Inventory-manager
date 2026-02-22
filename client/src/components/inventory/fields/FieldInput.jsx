import { Trash2, Eye, EyeOff } from 'lucide-react';
import { FieldTypeIcon } from './FieldTypeIcon';

const VisibilityBtn = ({ isVisible, onToggle }) => (
    <button type="button" onClick={onToggle} title="Toggle Visibility in Table" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
        {isVisible ? <Eye size={16} /> : <EyeOff size={16} className="text-gray-400" />}
    </button>
);

export function FieldInput({ field, onUpdate, onRemove }) {
    return (
        <div className="flex gap-3 items-start p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 shadow-sm animate-in slide-in-from-left-2">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border mt-1"><FieldTypeIcon type={field.type} /></div>
            <div className="flex-1 space-y-2">
                <input value={field.title} placeholder="Field Title" onChange={(e) => onUpdate({ title: e.target.value })} className="w-full bg-transparent font-semibold focus:outline-none" />
                <input value={field.description} placeholder="Tooltip Description" onChange={(e) => onUpdate({ description: e.target.value })} className="w-full bg-transparent text-sm text-gray-500 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <VisibilityBtn isVisible={field.isVisible} onToggle={() => onUpdate({ isVisible: !field.isVisible })} />
                <button type="button" onClick={onRemove} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
            </div>
        </div>
    );
}
