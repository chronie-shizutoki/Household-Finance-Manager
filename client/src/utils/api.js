import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com/api' 
    : 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true
});

// 请求拦截器
api.interceptors.request.use(config => {
  config.signal = new AbortController().signal;
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject({ 
        code: 'REQUEST_CANCELED',
        message: i18n.t('expense.common.requestCanceled')
      });
    }
    return Promise.reject({
      code: error.response?.status || 'NETWORK_ERROR',
      message: error.response?.data?.error?.message || i18n.t('expense.common.networkError'),
      details: error.config
    });
  }
);

export default api;