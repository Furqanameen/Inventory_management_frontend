import axios from 'axios';
import { notifications } from '@mantine/notifications';

export const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL, // Use Vite's environment variable
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Function to update headers dynamically
export const setAuthHeaders = (profileId) => {
  if (profileId) {
    api.defaults.headers.common['profile'] = profileId;
  } else {
    delete api.defaults.headers.common['profile'];
  }
};

const convertToFormData = (data, formData = new FormData(), parentKey = '') => {
  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      convertToFormData(value, formData, `${parentKey}[${index}]`);
    });
  } else if (typeof data === 'object' && data !== null) {
    if (data instanceof File) {
      formData.append(parentKey, data);
      // return formData;
    } else if (data instanceof Date) {
      formData.append(parentKey, data.toISOString());
    } else {
      Object.keys(data).forEach((key) => {
        convertToFormData(data[key], formData, parentKey ? `${parentKey}[${key}]` : key);
      });
    }
  } else {
    formData.append(parentKey, data);
  }
  return formData;
};

api.interceptors.request.use(
  (config) => {
    // If data exists and it's not already FormData, convert it
    if (config.data && !(config.data instanceof FormData)) {
      const formData = new FormData();

      // // Recursively append each key/value from the request body to FormData
      // Object.keys(config.data).forEach((key) => {
      //   const value = config.data[key];

      //   // If the value is an object or array, we can stringify it, or handle accordingly
      //   if (typeof value === 'object' && value !== null) {
      //     formData.append(key, JSON.stringify(value));
      //   } else {
      //     formData.append(key, value);
      //   }
      // });

      config.data = convertToFormData(config.data, formData);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle Unauthorized User (400)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('error.response', error.response);

    if (error.response.data.message === 'Unauthorized') {
      localStorage.removeItem('token'); // Remove token
      notifications.show({ message: 'Session expired. Please log in again.', color: 'red' });
      window.location.href = '/login'; // Redirect to login page
    }

    return Promise.reject(error);
  }
);

export default api;
