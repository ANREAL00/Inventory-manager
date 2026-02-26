import { Modal } from '../ui/Modal';
import { ItemForm } from './ItemForm';
import api from '../../api';
import { Trash2 } from 'lucide-react';

export function EditItemModal({ isOpen, onClose, item, fields, onUpdated, canEdit }) {
    const handleUpdate = async (data) => {
        try { await api.patch(`/items/${item.id}`, data); onUpdated(); onClose(); }
        catch (e) { alert(e.response?.status === 409 ? 'Conflict: Item was modified by another user.' : 'Update failed'); }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this item?')) return;
        try { await api.delete(`/items/${item.id}`); onUpdated(); onClose(); }
        catch (e) { alert('Delete failed'); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={canEdit ? `Edit Item: ${item?.customId}` : `View Item: ${item?.customId}`}>
            <ItemForm fields={fields} initialData={item} onSubmit={handleUpdate} readOnly={!canEdit} />
            {canEdit && (
                <button onClick={handleDelete} className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50">
                    <Trash2 size={18} /> Delete Item
                </button>
            )}
        </Modal>
    );
}
