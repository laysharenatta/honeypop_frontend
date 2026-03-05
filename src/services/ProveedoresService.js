import { useService } from '@/composables/useService';

const service = useService();
const resource = '/proveedores';

export const getAll = async (params = {}) => {
    const { data } = await service.get(resource, params);
    return data;
};
