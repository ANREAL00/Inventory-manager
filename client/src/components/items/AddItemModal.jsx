import { Modal } from '../ui/Modal';
import { ItemForm } from './ItemForm';
import { useTranslation } from 'react-i18next';
import api from '../../api';

export function AddItemModal({ isOpen, onClose, inventoryId, fields, customIdConfig, onCreated }) {
    const { t } = useTranslation();

    const handleSubmit = async (itemData) => {
        try {
            await api.post('/items', { ...itemData, inventoryId });
            onCreated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || t('err_create_item'));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('add_item_title')}>
            <ItemForm fields={fields} customIdConfig={customIdConfig} onSubmit={handleSubmit} />
        </Modal>
    );
}
