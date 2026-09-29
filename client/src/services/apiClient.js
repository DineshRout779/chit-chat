import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

// Set up API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Configure the API request
apiClient.interceptors.request.use(
  (config) => {
    // Update Authorization header with the latest token before each request
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//  Configure the API response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
    } else if (!error.response) {
      console.error('Network error or no response from server');
    } else {
      console.error(`Request failed with status ${error.response.status}`);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
