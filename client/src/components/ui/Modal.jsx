import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-950 border sm:rounded-2xl w-full sm:max-w-lg shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 rounded-t-2xl">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b shrink-0">
                    <h3 className="text-base sm:text-xl font-bold truncate pr-4" title={title}>{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg shrink-0">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
}
