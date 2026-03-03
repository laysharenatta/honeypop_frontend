import axios from "./useAxios";

export function useService() {
    return {
        get: (url, params = {}, config = {}) =>
            axios.get(url, { params, ...config }).then(response => response.data),
        post: (url, data = {}, config = {}) =>
            axios.post(url, data, config).then(response => response.data),
        put: (url, data = {}, config = {}) =>
            axios.put(url, data, config).then(response => response.data),
        delete: (url, config = {}) =>
            axios.delete(url, config).then(response => response.data),
    };
}
