import axios from 'axios';
import { getWebToken } from './local-storage';

// https://nx.dev/recipes/react/use-environment-variables-in-react
// export const BASE_URL = 'http://localhost:3000/api';
// export const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers['Authorization'] = `Bearer ${getWebToken()}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      window.history.pushState(null, '', '/login');
      window.location.reload();
    }

    // Do something with request error
    return Promise.reject(error);
  }
);
