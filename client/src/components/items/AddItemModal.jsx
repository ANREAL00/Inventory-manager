import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { ItemForm } from './ItemForm';
import { useTranslation } from 'react-i18next';
import api from '../../api';

export function AddItemModal({ isOpen, onClose, inventoryId, fields, onCreated }) {
    const [initialId, setInitialId] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) api.get(`/inventories/${inventoryId}/generate-id`).then(res => setInitialId(res.data.data.customId));
    }, [isOpen, inventoryId]);

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
            <ItemForm fields={fields} onSubmit={handleSubmit} initialData={{ customId: initialId }} />
        </Modal>
    );
}
