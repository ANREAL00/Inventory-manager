import { Type, AlignLeft, Hash, ImageIcon, CheckSquare, Calendar } from 'lucide-react';

const icons = {
    STRING: <Type size={16} />, TEXT: <AlignLeft size={16} />,
    NUMBER: <Hash size={16} />, IMAGE: <ImageIcon size={16} />,
    BOOLEAN: <CheckSquare size={16} />, DATE: <Calendar size={16} />
};

export const FieldTypeIcon = ({ type }) => icons[type] || icons.STRING;
