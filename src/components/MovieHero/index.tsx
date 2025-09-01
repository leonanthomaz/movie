import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  alpha, 
  useTheme,
  Fade,
  Chip,
  Stack,
  Skeleton
} from '@mui/material';
import { 
  PlayArrow, 
  Info, 
  Star
} from '@mui/icons-material';
import type { Movie } from '../../types/movie';

interface HeroProps {
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  isLoading?: boolean;
}

const Hero: React.FC<HeroProps> = ({ movies = [], onMovieSelect, isLoading = false }) => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();

  // Garante que temos um filme válido ou undefined
  const featuredMovie = movies.length > 0 ? movies[currentMovieIndex] : undefined;

  // Configuração do intervalo para trocar filmes
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
        setIsTransitioning(false);
      }, 1000);
    }, 8000); // Troca a cada 8 segundos

    return () => clearInterval(interval);
  }, [movies.length]);

  const backgroundImage = featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path}`
    : '';

  // Estado de loading
  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: { xs: '100%', md: '600px' }, pl: { md: 4 } }}>
            <Skeleton variant="rectangular" width={120} height={32} sx={{ mb: 3, borderRadius: 2 }} />
            <Skeleton variant="text" height={80} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 16 }} />
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 16 }} />
            </Box>
            <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" height={24} sx={{ mb: 4 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Skeleton variant="rectangular" width={140} height={48} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width={140} height={48} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  // Se não há filmes mesmo após o carregamento
  if (movies.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: { xs: '100%', md: '600px' }, pl: { md: 4 }, textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                color: theme.palette.primary.main,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                lineHeight: 1.1
              }}
            >
              Bem-vindo ao Movie
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                opacity: 0.9,
                fontWeight: 400
              }}
            >
              Explore milhares de filmes incríveis. Use a busca para encontrar seus favoritos!
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: backgroundImage
          ? `linear-gradient(
              to bottom,
              ${alpha(theme.palette.background.default, 0.2)} 0%,
              ${alpha(theme.palette.background.default, 0.7)} 80%,
              ${theme.palette.background.default} 100%
            ), url(${backgroundImage})`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {/* Overlay gradiente */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(
            to right,
            ${alpha(theme.palette.background.default, 0.9)} 0%,
            ${alpha(theme.palette.background.default, 0.7)} 30%,
            ${alpha(theme.palette.background.default, 0.5)} 50%,
            ${alpha(theme.palette.background.default, 0.3)} 70%,
            transparent 100%
          )`,
          zIndex: 1,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in={!isTransitioning} timeout={1000}>
          <Box sx={{ maxWidth: { xs: '100%', md: '600px' }, pl: { md: 4 } }}>
            {/* Indicador de filme em destaque */}
            {featuredMovie && (
              <Chip
                icon={<Star sx={{ color: theme.palette.primary.main }} />}
                label="Em Destaque"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  mb: 3,
                  fontSize: '0.9rem',
                  px: 1,
                }}
              />
            )}

            <Typography
              variant="h1"
              sx={{
                color: theme.palette.text.primary,
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {featuredMovie?.title || 'Descubra Filmes Incríveis'}
            </Typography>
            
            {featuredMovie && (
              <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {featuredMovie.vote_average > 0 && (
                  <Chip
                    icon={<Star sx={{ fontSize: 16 }} />}
                    label={featuredMovie.vote_average.toFixed(1)}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    }}
                  />
                )}
                {featuredMovie.release_date && (
                  <Chip
                    label={new Date(featuredMovie.release_date).getFullYear()}
                    sx={{
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                      color: theme.palette.text.primary,
                    }}
                  />
                )}
              </Stack>
            )}

            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                opacity: 0.9,
                fontWeight: 400,
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {featuredMovie?.overview || 
              'Explore milhares de filmes, encontre seus favoritos e descubra novas histórias para amar.'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {featuredMovie && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={() => onMovieSelect && onMovieSelect(featuredMovie)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Assistir
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<Info />}
                    onClick={() => onMovieSelect && onMovieSelect(featuredMovie)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderWidth: '2px',
                      borderRadius: 2,
                      '&:hover': {
                        borderWidth: '2px',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    Mais Info
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Hero;