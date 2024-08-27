import axios from 'axios';
import { BASE_URL } from '../constants';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    
    if (token && !config.url.includes('/login') && !config.url.includes('/register')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;