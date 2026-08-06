import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Interceptor to attach JWT Token from localStorage to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Endpoints
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// Subjects & Topics Endpoints
export const fetchSubjects = () => API.get('/subjects');
export const fetchTopicsBySubject = (subjectId) => API.get(`/topics/${subjectId}`);

// Notes Endpoints
export const fetchNotes = () => API.get('/notes');
export const fetchNoteById = (id) => API.get(`/notes/${id}`);
export const fetchMyNotes = () => API.get('/notes/my-notes');
export const searchNotes = (params) => API.get('/notes/search', { params });
export const uploadNote = (formData) => API.post('/notes', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Helper for download URL
export const getNoteDownloadUrl = (id) => `/api/notes/download/${id}`;

export default API;
