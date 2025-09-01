import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  alpha,
  useTheme,
  Skeleton
} from '@mui/material';
import { Star, CalendarToday, Visibility, PlayArrow } from '@mui/icons-material';
import type { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
  isLoading?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isLoading = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450/1E1E1E/FFD700?text=No+Image';

  const formatVoteCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getYearFromDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear().toString();
  };

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  // Mapeamento de IDs de gênero para nomes (você pode precisar ajustar isso)
  const genreMap: { [key: number]: string } = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Científica',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste'
  };

  if (isLoading) {
    return (
      <Card 
        sx={{ 
          width: '100%',
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          background: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', pt: '150%', overflow: 'hidden' }}>
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', top: 0, left: 0 }} />
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Skeleton variant="text" height={28} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={16} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" height={16} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={60} height={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      onClick={handleClick}
      sx={{ 
        cursor: 'pointer',
        width: '100%',
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          '& .play-overlay': {
            opacity: 1,
          }
        }
      }}
    >
      {/* Container da imagem com proporção fixa */}
      <Box sx={{ position: 'relative', width: '100%', pt: '150%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={movie.title}
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        
        {/* Overlay de play no hover */}
        <Box 
          className="play-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha(theme.palette.background.default, 0.7),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <PlayArrow sx={{ fontSize: 48, color: theme.palette.primary.main }} />
        </Box>
        
        {/* Overlays de informações */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Chip
            icon={<Star sx={{ fontSize: 16, color: theme.palette.primary.main }} />}
            label={movie.vote_average.toFixed(1)}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.background.default, 0.85),
              color: theme.palette.primary.main,
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          />
        </Box>
        
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Chip
            icon={<Visibility sx={{ fontSize: 16, color: theme.palette.text.secondary }} />}
            label={formatVoteCount(movie.vote_count)}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.background.default, 0.85),
              color: theme.palette.text.secondary,
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            }}
          />
        </Box>
        
        {/* Ano de lançamento na parte inferior */}
        <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
          <Chip
            icon={<CalendarToday sx={{ fontSize: 14, color: theme.palette.text.secondary }} />}
            label={getYearFromDate(movie.release_date)}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.background.default, 0.85),
              color: theme.palette.text.secondary,
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            }}
          />
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.2rem',
            lineHeight: 1.3,
            fontSize: '1.1rem'
          }}
        >
          {movie.title}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            flexGrow: 1
          }}
        >
          {movie.overview || 'Sinopse não disponível.'}
        </Typography>
        
        {movie.genre_ids && movie.genre_ids.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {movie.genre_ids.slice(0, 2).map((genreId) => (
              <Chip
                key={genreId}
                label={genreMap[genreId] || `Gênero ${genreId}`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  fontSize: '0.7rem',
                  height: 22,
                  fontWeight: 500
                }}
              />
            ))}
            {movie.genre_ids.length > 2 && (
              <Chip
                label={`+${movie.genre_ids.length - 2}`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                  color: theme.palette.text.secondary,
                  fontSize: '0.7rem',
                  height: 22,
                  fontWeight: 500
                }}
              />
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieCard;