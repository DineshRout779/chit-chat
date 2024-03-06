import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user')) || null;

const apiClient = axios.create({
  baseURL: import.meta.env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user ? user?.token : null}`,
  },
});

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let res = error.response;
    console.error(`Looks like there was a problem. Status Code: ${res.status}`);
    return Promise.reject(error);
  }
);

export default apiClient;
