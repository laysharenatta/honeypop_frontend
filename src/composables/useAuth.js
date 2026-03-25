import { ref, computed } from "vue";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getRol } from "@/services/Auth/AuthService";

const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const token = ref(localStorage.getItem('token') || null);
const rol = ref(localStorage.getItem('rol') || null);

const isAuthenticated = computed(() => !!token.value);

export function useAuth() {
    const login = async (credentials) => {
        const data = await apiLogin(credentials);

        token.value = data.token;
        user.value = data.user;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Obtener rol: primero desde la respuesta del login, luego del endpoint
        const rolFromUser = data.user?.rol || data.user?.role || null;
        if (rolFromUser) {
            rol.value = rolFromUser;
            localStorage.setItem("rol", rolFromUser);
        } else {
            try {
                const rolData = await getRol();
                rol.value = rolData.rol;
                localStorage.setItem("rol", rolData.rol);
            } catch (e) {
                console.warn('No se pudo obtener el rol:', e);
            }
        }

        return data;
    };

    const register = async (credentials) => {
        const data = await apiRegister(credentials);
        return data;
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error(error);
        }

        token.value = null;
        user.value = null;
        rol.value = null;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rol");
    };

    return {
        user,
        token,
        rol,
        isAuthenticated,
        login,
        register,
        logout
    }
}