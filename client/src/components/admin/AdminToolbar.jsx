import { Shield, ShieldAlert, Trash2, UserCheck, UserMinus } from 'lucide-react';

const ToolBtn = ({ onClick, color, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${color}`}
    >
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
    </button>
);

export function AdminToolbar({ onAction, selectedCount }) {
    if (selectedCount === 0) return null;

    return (
        <div className="flex gap-4 p-4 mb-4 bg-gray-50 dark:bg-gray-900 border rounded-lg animate-in fade-in slide-in-from-top-2">
            <ToolBtn onClick={() => onAction('block')} color="text-orange-500" icon={UserMinus} label="Block" />
            <ToolBtn onClick={() => onAction('unblock')} color="text-green-500" icon={UserCheck} label="Unblock" />
            <ToolBtn onClick={() => onAction('delete', 'delete')} color="text-red-500" icon={Trash2} label="Delete" />
            <ToolBtn onClick={() => onAction('role', 'patch', { role: 'ADMIN' })} color="text-blue-500" icon={Shield} label="Make Admin" />
            <ToolBtn onClick={() => onAction('role', 'patch', { role: 'USER' })} color="text-gray-500" icon={ShieldAlert} label="Remove Admin" />
            <div className="ml-auto flex items-center text-sm font-medium">{selectedCount} selected</div>
        </div>
    );
}
