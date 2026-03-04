import axios from "./useAxios";

export function useService() {
    return {
        get: (url, params = {}, config = {}) =>
            axios.get(url, { params, ...config }),
        post: (url, data = {}, config = {}) =>
            axios.post(url, data, config),
        put: (url, data = {}, config = {}) =>
            axios.put(url, data, config),
        delete: (url, config = {}) =>
            axios.delete(url, config),
    };
}
