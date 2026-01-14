import axios from 'axios';

const api = axios.create({
  baseURL: 'https://desafio-procion.onrender.com' // O endereço do backend
});

export default api;