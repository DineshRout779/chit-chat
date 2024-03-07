import axios from 'axios';

// Retrieve token from localStorage
const getToken = () => {
  return localStorage.getItem('token') || null;
};

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
  }
);

//  Configure the API response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let res = error.response;
    console.error(`Looks like there was a problem. Status Code: ${res.status}`);
    return Promise.reject(error);
  }
);

export default apiClient;
