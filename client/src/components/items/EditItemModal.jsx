import { Modal } from '../ui/Modal';
import { ItemForm } from './ItemForm';
import api from '../../api';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function EditItemModal({ isOpen, onClose, item, fields, customIdConfig, onUpdated, canEdit }) {
    const { t } = useTranslation();

    const handleUpdate = async (data) => {
        try { await api.patch(`/items/${item.id}`, data); onUpdated(); onClose(); }
        catch (e) { alert(e.response?.status === 409 ? t('err_conflict_item') : t('err_update_item')); }
    };

    const handleDelete = async () => {
        if (!confirm(t('delete_confirm'))) return;
        try { await api.delete(`/items/${item.id}`); onUpdated(); onClose(); }
        catch (e) { alert(t('err_delete_item')); }
    };

    const truncateId = (id) => (id?.length > 20 ? `${id.slice(0, 20)}...` : id);

    const title = canEdit
        ? `${t('edit_item_title')}: ${truncateId(item?.customId)}`
        : `${t('view_item_title')}: ${truncateId(item?.customId)}`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <ItemForm key={item?.id} fields={fields} customIdConfig={customIdConfig} initialData={item} onSubmit={handleUpdate} readOnly={!canEdit} />
            {canEdit && (
                <button onClick={handleDelete} className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50">
                    <Trash2 size={18} /> {t('delete_item')}
                </button>
            )}
        </Modal>
    );
}
