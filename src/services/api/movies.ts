// src/services/api/movies.ts
import { api } from '.';

export const moviesApi = {
    // Filmes populares
    getPopular: () => api.get('/movie/popular'),
    
    // Filmes em cartaz
    getNowPlaying: () => api.get('/movie/now_playing'),
    
    // Próximos lançamentos
    getUpcoming: () => api.get('/movie/upcoming'),
    
    // Melhores avaliados
    getTopRated: () => api.get('/movie/top_rated'),
    
    // Buscar filmes
    search: (query: string) => api.get('/search/movie', {
        params: { query }
    }),
    
    // Detalhes do filme com videos e creditos
    getDetails: (id: number) => api.get(`/movie/${id}`, {
        params: { append_to_response: 'videos,credits' }
    }),

    // Filmes recomendados (NOVA FUNÇÃO ADICIONADA)
    getRecommendations: (id: number) => api.get(`/movie/${id}/recommendations`),
    
    // Gêneros
    getGenres: () => api.get('/genre/movie/list'),

    // Buscar filmes por gênero (simulado)
    getByGenre: (genreId: number, page: number = 1) => 
        api.get('/discover/movie', {
        params: { 
            with_genres: genreId,
            page: page,
            sort_by: 'popularity.desc'
        }
        }),
};