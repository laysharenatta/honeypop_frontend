import { useService } from '@/composables/useService';

const service = useService();
const resource = '/reportes';

export const getProductosMasVendidos = async () => {
    try {
        const { data } = await service.get(`${resource}/productos-mas-vendidos`);
        return data;
    } catch (error) {
        console.error("Error en getProductosMasVendidos:", error);
        return [];
    }
};

export const getInventarioCritico = async () => {
    try {
        const { data } = await service.get(`${resource}/inventario-critico`);
        return data;
    } catch (error) {
        console.error("Error en getInventarioCritico:", error);
        return [];
    }
};

export const getRotacionLenta = async () => {
    try {
        const { data } = await service.get(`${resource}/rotacion-lenta`);
        return data;
    } catch (error) {
        console.error("Error en getRotacionLenta:", error);
        return [];
    }
};

export const getConteoEstrategias = async () => {
    try {
        const { data } = await service.get(`${resource}/conteo-estrategias`);
        return data;
    } catch (error) {
        console.error("Error en getConteoEstrategias:", error);
        return null;
    }
};
