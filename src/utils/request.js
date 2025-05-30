import axios from "axios";
import { getToken } from "../components/constants";

// const getToken = () => {
//     return getTokenFromLocalStorage();
// };

// const request = axios.create({
//     baseURL: 'https://tough-crisp-malamute.ngrok-free.app/api/',
//     // headers: {
//     //     'Authorization': getToken() ? `Bearer ${getToken()}` : ''
//     // },
//     withCredentials: true, 
// })
const request = axios.create({
    baseURL: 'http://26.139.159.129:5024/api/',
    headers: {
        'Authorization': getToken() ? `Bearer ${getToken()}` : ''
    },
    withCredentials: true,
})

request.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                console.log(status);
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const remove = async (path, options = {}) => {
    const headers = {
       // 'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.delete(path, { ...options, headers });
    return response.data;
};

export const get = async (path, options = {}) => {
    const headers = {
        //'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.get(path, { ...options, headers });
    
    return response.data;
};

export const post = async (path, data = {}, options = {}) => {
    const headers = {
       // 'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.post(path, data, { ...options, headers });
    return response.data;
};

export const put = async (path, data = {}, options = {}) => {
    const headers = {
       // 'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.put(path, data, { ...options, headers });
    return response.data;
};

export default request