import { FieldInput } from './FieldInput';
import { Type, AlignLeft, Hash, ImageIcon, CheckSquare, Calendar, Plus } from 'lucide-react';

const AddBtn = ({ type, label, onClick, icon: Icon }) => (
    <button onClick={() => onClick(type)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border rounded-full hover:bg-gray-100 transition-colors">
        <Icon size={14} /> {label}
    </button>
);

const FieldTypes = ({ onAdd }) => (
    <div className="flex flex-wrap gap-2 pt-2">
        <AddBtn type="STRING" label="Text" icon={Type} onClick={onAdd} />
        <AddBtn type="TEXT" label="Multiline" icon={AlignLeft} onClick={onAdd} />
        <AddBtn type="NUMBER" label="Number" icon={Hash} onClick={onAdd} />
        <AddBtn type="IMAGE" label="Image/Link" icon={ImageIcon} onClick={onAdd} />
        <AddBtn type="BOOLEAN" label="Checkbox" icon={CheckSquare} onClick={onAdd} />
        <AddBtn type="DATE" label="Date" icon={Calendar} onClick={onAdd} />
    </div>
);

export function FieldConfigurator({ fields, addField, updateField, removeField }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="text-lg font-bold">Custom Fields</h3></div>
            <div className="space-y-3">
                {fields.map((f, i) => <FieldInput key={i} field={f} onUpdate={(u) => updateField(i, u)} onRemove={() => removeField(i)} />)}
            </div>
            <FieldTypes onAdd={addField} />
        </div>
    );
}
