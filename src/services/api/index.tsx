import axios from 'axios';

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3"
});

// Adicionar interceptor para incluir a chave de API em todas as requisições
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_API_KEY,
    language: 'pt-BR'
  };
  
  // Adicionar token de autenticação se necessário
  if (import.meta.env.VITE_TMDB_TOKEN) {
    config.headers.Authorization = `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`;
  }
  
  return config;
});