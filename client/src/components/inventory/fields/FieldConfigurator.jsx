import { FieldInput } from './FieldInput';
import { Type, AlignLeft, Hash, ImageIcon, CheckSquare, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AddBtn = ({ type, label, onClick, icon: Icon }) => (
    <button type="button" onClick={() => onClick(type)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border rounded-full hover:bg-gray-100 transition-colors">
        <Icon size={14} /> {label}
    </button>
);

const FieldTypes = ({ onAdd, t }) => (
    <div className="flex flex-wrap gap-2 pt-2">
        <AddBtn type="STRING" label={t('type_text')} icon={Type} onClick={onAdd} />
        <AddBtn type="TEXT" label={t('type_multiline')} icon={AlignLeft} onClick={onAdd} />
        <AddBtn type="NUMBER" label={t('type_number')} icon={Hash} onClick={onAdd} />
        <AddBtn type="IMAGE" label={t('type_image')} icon={ImageIcon} onClick={onAdd} />
        <AddBtn type="BOOLEAN" label={t('type_checkbox')} icon={CheckSquare} onClick={onAdd} />
        <AddBtn type="DATE" label={t('type_date')} icon={Calendar} onClick={onAdd} />
    </div>
);

import { Reorder } from 'framer-motion';

export function FieldConfigurator({ fields, addField, updateField, removeField, reorderFields }) {
    const { t } = useTranslation();
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="text-lg font-bold">{t('custom_fields')}</h3></div>
            <Reorder.Group axis="y" values={fields} onReorder={reorderFields} className="space-y-3">
                {fields.map((f, i) => (
                    <Reorder.Item key={f.id || i} value={f}>
                        <FieldInput field={f} onUpdate={(u) => updateField(i, u)} onRemove={() => removeField(i)} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <FieldTypes onAdd={addField} t={t} />
        </div>
    );
}
