import { Modal } from '../ui/Modal';
import { ItemForm } from './ItemForm';
import api from '../../api';

export function AddItemModal({ isOpen, onClose, inventoryId, fields, onCreated }) {
    const handleSubmit = async (itemData) => {
        try {
            await api.post('/items', { ...itemData, inventoryId });
            onCreated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create item');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Item">
            <ItemForm fields={fields} onSubmit={handleSubmit} />
        </Modal>
    );
}
