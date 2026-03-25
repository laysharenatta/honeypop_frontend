import { useService } from '@/composables/useService';

const service = useService();
const resource = '/clientes';

export const getAll = async (params = {}) => {
    const { data } = await service.get(resource, params);
    return data;
};

export const getById = async (id) => {
    const { data } = await service.get(`${resource}/${id}`);
    return data;
};

export const create = async (payload) => {
    const { data } = await service.post(resource, payload);
    return data;
};

export const update = async (id, payload) => {
    const { data } = await service.put(`${resource}/${id}`, payload);
    return data;
};

export const deleteCliente = async (id) => {
    const { data } = await service.delete(`${resource}/${id}`);
    return data;
};
