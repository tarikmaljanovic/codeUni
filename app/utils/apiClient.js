import axios from 'axios';
import { getAuthHeaders, clearAuthData } from './auth';

const apiClient = axios.create({
    baseURL: process.env.API_HOST
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
    (config) => {
        const headers = getAuthHeaders();
        config.headers = {
            ...config.headers,
            ...headers
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuthData();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const secureGet = async (url) => {
    try {
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const securePost = async (url, data) => {
    try {
        const response = await apiClient.post(url, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const securePut = async (url, data) => {
    try {
        const response = await apiClient.put(url, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const secureDelete = async (url) => {
    try {
        const response = await apiClient.delete(url);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        console.error('API Error:', error.response.data);
        if (error.response.status === 403) {
            throw new Error('You do not have permission to perform this action');
        }
    } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.request);
        throw new Error('Network error occurred. Please try again.');
    } else {
        // Error in request setup
        console.error('Request Error:', error.message);
        throw new Error('An error occurred. Please try again.');
    }
}; 