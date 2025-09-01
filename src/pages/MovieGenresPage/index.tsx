// src/pages/MovieGenresPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  alpha,
  useTheme,
  Breadcrumbs,
  Link,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
} from '@mui/material';
import {
  Home,
  Whatshot,
  Theaters,
  Star,
  CalendarToday,
  NavigateNext
} from '@mui/icons-material';
import { moviesApi } from '../../services/api/movies';
import type { Movie, Genre } from '../../types/movie';
import Navbar from '../../components/Navbar';
import MovieCard from '../../components/MovieCard';
import Loading from '../../components/Loading';

const MovieGenresPage: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'vote_average' | 'release_date'>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Buscar lista de gêneros
  const fetchGenres = useCallback(async () => {
    try {
      setLoading(true);
      const response = await moviesApi.getGenres();
      setGenres(response.data.genres);
      
      // Se há um genreId na URL, selecionar o gênero correspondente
      if (genreId) {
        const genre = response.data.genres.find((g: { id: number; }) => g.id === parseInt(genreId));
        if (genre) {
          setSelectedGenre(genre);
          fetchMoviesByGenre(genre.id, 1, sortBy);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
    } finally {
      setLoading(false);
    }
  }, [genreId, sortBy]);

  // Buscar filmes por gênero
  const fetchMoviesByGenre = useCallback(async (genreId: number, page: number = 1, sort: string = 'popularity') => {
    try {
      setMoviesLoading(true);
      const response = await moviesApi.getPopular();
      
      // Filtrar filmes pelo gênero selecionado (simulado já que a API TMDB não tem endpoint direto)
      let filteredMovies = response.data.results;
      
      if (genreId !== -1) { // -1 representa "Todos os gêneros"
        filteredMovies = response.data.results.filter((movie: { genre_ids: number[]; }) => 
          movie.genre_ids.includes(genreId)
        );
      }
      
      // Ordenar filmes
      const sortedMovies = [...filteredMovies].sort((a, b) => {
        switch (sort) {
          case 'vote_average':
            return b.vote_average - a.vote_average;
          case 'release_date':
            return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
          case 'popularity':
          default:
            return b.popularity - a.popularity;
        }
      });
      
      // Paginação simples (20 filmes por página)
      const startIndex = (page - 1) * 20;
      const paginatedMovies = sortedMovies.slice(startIndex, startIndex + 20);
      
      setMovies(paginatedMovies);
      setTotalPages(Math.ceil(sortedMovies.length / 20));
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setMoviesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre.id, currentPage, sortBy);
    }
  }, [selectedGenre, currentPage, sortBy, fetchMoviesByGenre]);

  const handleGenreSelect = (genre: Genre | null) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    
    if (genre) {
      navigate(`/genres/${genre.id}`);
      document.title = `${genre.name} - Movie`;
    } else {
      navigate('/genres');
      document.title = 'Todos os Gêneros - Movie';
    }
  };

  const handleSortChange = (_event: React.MouseEvent<HTMLElement>, newSort: string | null) => {
    if (newSort) {
      setSortBy(newSort as 'popularity' | 'vote_average' | 'release_date');
      setCurrentPage(1);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGenreIcon = (genreName: string) => {
    switch (genreName.toLowerCase()) {
      case 'action': return <Whatshot />;
      case 'drama': return <Theaters />;
      case 'comedy': return <Star />;
      case 'documentary': return <CalendarToday />;
      default: return <Star />;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link
            color="inherit"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5, fontSize: 20 }} />
            Início
          </Link>
          <Typography color="text.primary">
            {selectedGenre ? selectedGenre.name : 'Gêneros'}
          </Typography>
        </Breadcrumbs>

        {/* Título */}
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.text.primary,
            mb: 4,
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {selectedGenre ? selectedGenre.name : 'Explorar Gêneros'}
        </Typography>

        {/* Lista de Gêneros */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, color: theme.palette.text.primary }}>
            Selecione um Gênero
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
            <Chip
              icon={<Whatshot />}
              label="Todos"
              onClick={() => handleGenreSelect(null)}
              variant={!selectedGenre ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: !selectedGenre ? 
                  alpha(theme.palette.primary.main, 0.15) : 'transparent',
                color: !selectedGenre ? 
                  theme.palette.primary.main : theme.palette.text.secondary,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                fontSize: '1rem',
                py: 2,
                px: 1.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            />
            
            {genres.map((genre) => (
              <Chip
                key={genre.id}
                icon={getGenreIcon(genre.name)}
                label={genre.name}
                onClick={() => handleGenreSelect(genre)}
                variant={selectedGenre?.id === genre.id ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: selectedGenre?.id === genre.id ? 
                    alpha(theme.palette.primary.main, 0.15) : 'transparent',
                  color: selectedGenre?.id === genre.id ? 
                    theme.palette.primary.main : theme.palette.text.secondary,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  fontSize: '1rem',
                  py: 2,
                  px: 1.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Controles de Ordenação e Resultados */}
        {selectedGenre && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                {movies.length} filmes encontrados
              </Typography>
              
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={handleSortChange}
                aria-label="ordenar por"
              >
                <ToggleButton value="popularity" aria-label="popularidade">
                  <Whatshot sx={{ mr: 1 }} />
                  Popularidade
                </ToggleButton>
                <ToggleButton value="vote_average" aria-label="avaliação">
                  <Star sx={{ mr: 1 }} />
                  Avaliação
                </ToggleButton>
                <ToggleButton value="release_date" aria-label="data de lançamento">
                  <CalendarToday sx={{ mr: 1 }} />
                  Lançamento
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        )}

        {/* Grid de Filmes usando Box e Stack */}
        {selectedGenre ? (
          <>
            {moviesLoading ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                  },
                  gap: 3
                }}
              >
                {[...Array(12)].map((_, index) => (
                  <Box key={index}>
                    <Skeleton 
                      variant="rectangular" 
                      height={400} 
                      sx={{ 
                        borderRadius: 3,
                        width: '100%'
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            ) : movies.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    },
                    gap: 3
                  }}
                >
                  {movies.map((movie) => (
                    <Box key={movie.id}>
                      <MovieCard movie={movie} />
                    </Box>
                  ))}
                </Box>
                
                {/* Paginação */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: theme.palette.text.primary,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            color: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10, color: theme.palette.text.secondary }}>
                <Typography variant="h5" gutterBottom>
                  Nenhum filme encontrado
                </Typography>
                <Typography variant="body1">
                  Não encontramos filmes para este gênero.
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10, color: theme.palette.text.secondary }}>
            <Typography variant="h5" gutterBottom>
              Selecione um gênero para explorar
            </Typography>
            <Typography variant="body1">
              Escolha um gênero acima para ver os filmes disponíveis.
            </Typography>
          </Box>
        )}
      </Container>
      
    </Box>
  );
};

export default MovieGenresPage;