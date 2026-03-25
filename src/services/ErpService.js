import { useService } from '@/composables/useService';

const service = useService();
const resource = '/erp';

export const getEstado = async () => {
    const { data } = await service.get(`${resource}/estado`);
    return data;
};

export const updateEstado = async (payload) => {
    const { data } = await service.put(`${resource}/estado`, payload);
    return data;
};

export const getMetricas = async () => {
    const { data } = await service.get(`${resource}/metricas`);
    return data;
};
