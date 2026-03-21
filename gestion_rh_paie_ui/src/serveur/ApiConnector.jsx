import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

export const Api = axios.create({ baseURL: BASE_URL, withCredentials: false });

Api.interceptors.request.use(
    (config) => {
        const access = localStorage.getItem("access");
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

Api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem("refresh");

            if (!refresh) {                               
                window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh });
                localStorage.setItem("access", res.data.access);

                if (res.data.refresh) {                  
                    localStorage.setItem("refresh", res.data.refresh);
                }

                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return Api(originalRequest);
            } catch (err) {
                console.error("Token refresh failed:", err); 
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/";              
            }
        }

        return Promise.reject(error);
    }
);