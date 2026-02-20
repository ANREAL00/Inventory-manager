import api from './index';

export const getMyInventories = async () => {
    const { data } = await api.get('/inventories/me');
    return data.data.inventories;
};

export const getSharedInventories = async () => {
    const { data } = await api.get('/inventories/shared');
    return data.data.inventories;
};
