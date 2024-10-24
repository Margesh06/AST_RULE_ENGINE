import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export const createRule = (rule) => api.post('/api/rules', rule);
export const getRules = () => api.get('/api/rules');
export const evaluateRule = (data) => api.post('/api/rules/evaluate', data);

export default api;
