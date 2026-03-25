import { useService } from '@/composables/useService';

const service = useService();
const resource = '/ordenes';

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

export const updateStatus = async (id, payload) => {
    const { data } = await service.put(`${resource}/${id}/estado`, payload);
    return data;
};

export const procesar = async (payload) => {
    const { data } = await service.post(`${resource}/procesar`, payload);
    return data;
};
