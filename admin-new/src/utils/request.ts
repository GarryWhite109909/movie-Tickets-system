import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use(
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

request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 1 && res.code !== 0) { // Assuming 0 and 1 are success codes based on legacy system
      message.error(res.msg || 'Error');
      if (res.code === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    message.error(error.message || 'Network Error');
    if (error.response && error.response.status === 401) {
       localStorage.removeItem('token');
       window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
