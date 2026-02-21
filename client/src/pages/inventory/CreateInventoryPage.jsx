import { InventoryForm } from '../../components/inventory/InventoryForm';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function CreateInventoryPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post('/inventories', data);
            navigate('/profile');
        } catch (err) {
            alert('Failed to create inventory');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8">
            <h1 className="text-3xl font-extrabold text-center mb-8">Create New Inventory</h1>
            <InventoryForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
