import { useService } from '@/composables/useService';

const service = useService();

export const register = (user) => {
    return service.post('/register', {
        name: user.name,
        email: user.email,
        password: user.password
    });
}

export const login = async (user) => {
    const { data } = await service.post('/login', {
        email: user.email,
        password: user.password
    });

    return data;
}

export const logout = () => {
    return service.post('/logout');
}

