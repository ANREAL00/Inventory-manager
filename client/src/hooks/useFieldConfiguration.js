import { useState } from 'react';

const MAX_PER_TYPE = 3;

export function useFieldConfiguration(initialFields = []) {
    const [fields, setFields] = useState(initialFields);

    const getCountByType = (type) => fields.filter(f => f.type === type).length;

    const addField = (type) => {
        if (getCountByType(type) >= MAX_PER_TYPE) return alert(`Max ${MAX_PER_TYPE} ${type} fields allowed`);
        const id = `new-${Date.now()}`;
        setFields([...fields, { id, type, title: '', description: '', isVisible: true, index: getCountByType(type) + 1 }]);
    };

    const updateField = (index, updates) => {
        setFields(fields.map((f, i) => i === index ? { ...f, ...updates } : f));
    };

    const removeField = (index) => setFields(fields.filter((_, i) => i !== index));

    const reorderFields = (newFields) => setFields(newFields);

    return { fields, addField, updateField, removeField, reorderFields };
}
