import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api',
  withCredentials: true, // Enable cookies for CORS
});

export default api;