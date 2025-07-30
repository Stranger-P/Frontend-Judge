import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export const createProblem = (formData) =>
  API.post('/problems', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);

export const getProblemById = (id) =>
  API.get(`/problems/${id}`).then(res => res.data);
