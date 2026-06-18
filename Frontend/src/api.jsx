// File path: src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pmb.finance/api',
  withCredentials: true, 
});

export default api;