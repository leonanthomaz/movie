import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Theaters,
  Star,
  ArrowForward,
  LocalFireDepartment,
  Whatshot
} from '@mui/icons-material';
import type { Movie } from '../../../types/movie';
import MovieCard from '../MovieCard';

interface MovieCarouselProps {
  title: string;
  description?: string;
  movies: Movie[];
  icon?: React.ReactNode;
  isLoading?: boolean;
  viewAllLink?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  title, 
  movies, 
  icon, 
  isLoading = false,
  viewAllLink 
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const getIconForTitle = (title: string) => {
    const iconStyle = { fontSize: 28, color: theme.palette.primary.main };
    
    switch (title.toLowerCase()) {
      case 'populares':
        return <LocalFireDepartment sx={iconStyle} />;
      case 'em cartaz':
        return <Theaters sx={iconStyle} />;
      case 'melhores avaliados':
        return <Star sx={iconStyle} />;
      case 'em alta':
        return <Whatshot sx={iconStyle} />;
      case 'tendências':
        return <TrendingUp sx={iconStyle} />;
      default:
        return icon || <Star sx={iconStyle} />;
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile 
        ? scrollContainerRef.current.clientWidth * 0.9
        : scrollContainerRef.current.clientWidth * 0.7;
      
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollPosition, 300);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      
      // Re-check after images load
      const images = container.querySelectorAll('img');
      let imagesLoaded = 0;
      
      const imageLoadHandler = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
          checkScrollPosition();
        }
      };
      
      images.forEach(img => {
        if (img.complete) {
          imagesLoaded++;
        } else {
          img.addEventListener('load', imageLoadHandler);
        }
      });
      
      if (images.length === 0 || imagesLoaded === images.length) {
        checkScrollPosition();
      }
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        images.forEach(img => img.removeEventListener('load', imageLoadHandler));
      };
    }
  }, [movies, isMobile, isTablet]);

  // Skeleton loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        py: 8, 
        background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.paper, 0.3)} 100%)` 
      }}>
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={200} height={40} />
            </Stack>
            {!isMobile && (
              <Stack direction="row" spacing={1}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
              </Stack>
            )}
          </Stack>
          
          <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden' }}>
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ flexShrink: 0, width: { xs: 180, sm: 220, md: 280 } }}>
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 3 }} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  if (movies.length === 0) return null;

  return (
    <Box sx={{ 
      py: 8, 
      background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.paper, 0.3)} 100%)`,
      position: 'relative'
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4, px: { xs: 0, md: 2 } }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {getIconForTitle(title)}
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              {title}
            </Typography>
          </Stack>

          {/* Navegação ou Botão "Ver Mais" */}
          {!isMobile ? (
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => scroll('left')}
                sx={{
                  color: showLeftArrow ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
                  backgroundColor: showLeftArrow ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  border: `1px solid ${showLeftArrow ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`,
                  opacity: showLeftArrow ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'translateX(-2px)'
                  },
                  '&.Mui-disabled': {
                    opacity: 0.3
                  }
                }}
                disabled={!showLeftArrow}
              >
                <ChevronLeft />
              </IconButton>
              
              <IconButton
                onClick={() => scroll('right')}
                sx={{
                  color: showRightArrow ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
                  backgroundColor: showRightArrow ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  border: `1px solid ${showRightArrow ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`,
                  opacity: showRightArrow ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'translateX(2px)'
                  },
                  '&.Mui-disabled': {
                    opacity: 0.3
                  }
                }}
                disabled={!showRightArrow}
              >
                <ChevronRight />
              </IconButton>
            </Stack>
          ) : (
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{
                color: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
              onClick={() => viewAllLink && (window.location.href = viewAllLink)}
            >
              Ver Todos
            </Button>
          )}
        </Stack>

        {/* Listagem de filmes com setas de navegação flutuantes para desktop */}
        <Box sx={{ position: 'relative' }}>
          {!isMobile && showLeftArrow && (
            <Box
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: `linear-gradient(90deg, ${theme.palette.background.default} 30%, transparent)`,
                pl: 2,
                pr: 4,
                py: 8
              }}
            >
              <IconButton
                onClick={() => scroll('left')}
                sx={{
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
            </Box>
          )}

          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              pb: 3,
              px: { xs: 0, md: 2 },
              mx: { xs: 0, md: -2 }
            }}
          >
            {movies.map((movie) => (
              <Box
                key={movie.id}
                sx={{
                  flexShrink: 0,
                  width: { 
                    xs: '180px', 
                    sm: '220px', 
                    md: '280px',
                    lg: '300px'
                  },
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <MovieCard movie={movie} />
              </Box>
            ))}
          </Box>

          {!isMobile && showRightArrow && (
            <Box
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: `linear-gradient(270deg, ${theme.palette.background.default} 30%, transparent)`,
                pl: 4,
                pr: 2,
                py: 8
              }}
            >
              <IconButton
                onClick={() => scroll('right')}
                sx={{
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default MovieCarousel;