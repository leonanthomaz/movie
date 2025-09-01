import { useState, useEffect, useCallback } from 'react';
import { Box, Container, Snackbar, Alert, Fab, Fade, Typography } from '@mui/material';
import { KeyboardArrowUp, Refresh } from '@mui/icons-material';
import { moviesApi } from './services/api/movies';
import type { Movie } from './types/movie';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Hero from './components/MovieHero';
import MovieCarousel from './components/MovieCarousel';
import Footer from './components/Footer';

export const App = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar filmes
  const fetchMovies = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [popularRes, nowPlayingRes, topRatedRes, upcomingRes] = await Promise.all([
        moviesApi.getPopular(),
        moviesApi.getNowPlaying(),
        moviesApi.getTopRated(),
        moviesApi.getUpcoming()
      ]);

      setPopularMovies(popularRes.data.results.slice(0, 12));
      setNowPlaying(nowPlayingRes.data.results.slice(0, 12));
      setTopRated(topRatedRes.data.results.slice(0, 12));
      setUpcoming(upcomingRes.data.results.slice(0, 12));

    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Erro ao carregar filmes. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieSelect = (movie: Movie) => {
    // Navegar para a página de detalhes do filme
    window.location.href = `/movie/${movie.id}`;
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Combina filmes de todas as categorias para o Hero
  const allMovies = [...popularMovies, ...nowPlaying, ...topRated, ...upcoming];
  
  // Remove duplicatas (caso um filme esteja em múltiplas categorias)
  const uniqueMovies = allMovies.filter((movie, index, self) =>
    index === self.findIndex((m) => m.id === movie.id)
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main>
        {/* Hero com carrossel de filmes */}
        <Hero 
          movies={uniqueMovies.slice(0, 10)}
          onMovieSelect={handleMovieSelect}
          isLoading={loading}
        />
        
        <Box sx={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)' }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {popularMovies.length > 0 && (
              <MovieCarousel 
                title="🔥 Populares" 
                movies={popularMovies}
                description="Os filmes mais populares do momento"
              />
            )}
            {nowPlaying.length > 0 && (
              <MovieCarousel 
                title="🎬 Em Cartaz" 
                movies={nowPlaying}
                description="Filmes em exibição nos cinemas"
              />
            )}
            {topRated.length > 0 && (
              <MovieCarousel 
                title="⭐ Melhores Avaliados" 
                movies={topRated}
                description="Os filmes com as melhores avaliações"
              />
            )}
            {upcoming.length > 0 && (
              <MovieCarousel 
                title="🚀 Em Breve" 
                movies={upcoming}
                description="Próximos lançamentos nos cinemas"
              />
            )}
            {popularMovies.length === 0 && 
             nowPlaying.length === 0 && 
             topRated.length === 0 && 
             upcoming.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
                <Refresh sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" gutterBottom>
                  Nenhum filme encontrado
                </Typography>
                <Typography variant="body1">
                  Tente atualizar a página ou verificar sua conexão
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      </main>
      <Footer />
      <Fade in={showScrollTop}>
        <Fab onClick={scrollToTop} sx={{ position: 'fixed', bottom: 24, right: 24, backgroundColor: 'primary.main', color: 'black', '&:hover': { backgroundColor: 'primary.dark', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }} size="medium">
          <KeyboardArrowUp />
        </Fab>
      </Fade>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      {refreshing && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FFD700, #FFC400)', zIndex: 9999, animation: 'loading 1.5s infinite' }} />
      )}
    </Box>
  );
};