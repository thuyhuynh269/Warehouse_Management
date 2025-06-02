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
            if (status === 401) {
                window.location.href = '/login';
            }
            if (status === 403){
                window.location.href = '/';
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
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': getToken() ? `Bearer ${getToken()}` : '',
            ...options.headers,
        };
        
        console.log(`Making PUT request to ${path} with data:`, data);
        
        const response = await request.put(path, data, { 
            ...options, 
            headers,
            validateStatus: status => status >= 200 && status < 300
        });
        
        console.log(`PUT request response:`, response);
        return response.data;
    } catch (error) {
        console.error(`PUT request failed for ${path}:`, error);
        throw error;
    }
};

export default request