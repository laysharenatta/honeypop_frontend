import { useService } from '@/composables/useService';

const service = useService();

const resource = '/interacciones';

export const getAll = async () => {

    const { data } = await service.get(resource);

    return data;
};

export const create = async (payload) => {

    const { data } = await service.post(resource, payload);

    return data;
};

export const getHistorialByCliente = async (clienteId) => {

    const { data } = await service.get(`/clientes/${clienteId}/interacciones`);

    return data;
};