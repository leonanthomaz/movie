import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  alpha,
  useTheme,
  useMediaQuery,
  Slide,
  Chip,
  Drawer,
  Divider,
  ListItemButton,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Search as SearchIcon,
  Close,
  Home,
  Whatshot,
  Star,
  Theaters,
  Menu as MenuIcon,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { moviesApi } from '../../services/api/movies';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Movie } from '../../types/movie';

const MovieSearchCard = ({ movie, onClick }: { movie: Movie; onClick: () => void }) => {
  const theme = useTheme();
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/50x75/1E1E1E/FFD700?text=No+Image';

  return (
    <ListItem
      component="div"
      onClick={onClick}
      sx={{
        width: '100%',
        textAlign: 'left',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        py: 1.5,
        px: 2,
        transition: 'all 0.2s ease',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&:last-child': {
          borderBottom: 'none'
        },
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      }}
    >
      <ListItemAvatar>
        <Avatar 
          src={posterUrl} 
          variant="rounded" 
          sx={{ 
            width: 50, 
            height: 75,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }} 
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body1" fontWeight={600} noWrap>
            {movie.title}
          </Typography>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            {movie.release_date && (
              <Typography variant="caption" color="text.secondary">
                {new Date(movie.release_date).getFullYear()}
              </Typography>
            )}
            {movie.vote_average > 0 && (
              <Chip
                icon={<Star sx={{ fontSize: 14 }} />}
                label={movie.vote_average.toFixed(1)}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                }}
              />
            )}
          </Box>
        }
        sx={{ ml: 2 }}
      />
    </ListItem>
  );
};

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [genresExpanded, setGenresExpanded] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await moviesApi.getGenres();
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const response = await moviesApi.search(searchQuery);
          setSearchResults(response.data.results.slice(0, 5));
          setShowResults(true);
        } catch (error) {
          console.error('Erro ao buscar filmes:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleLogoClick = () => {
    navigate('/');
    setSearchQuery('');
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    inputRef.current?.focus();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleGenresExpanded = () => {
    setGenresExpanded(!genresExpanded);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setGenresExpanded(false);
  };

  const getNavItems = () => [
    { label: 'Início', icon: <Home />, path: '/' },
    { label: 'Populares', icon: <Whatshot />, path: '/genres/popular' },
    { label: 'Em Cartaz', icon: <Theaters />, path: '/genres/now-playing' },
    { label: 'Melhores', icon: <Star />, path: '/genres/top-rated' },
    { label: 'Gêneros', icon: <Theaters />, path: '/genres', hasSubmenu: true },
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={4}
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.98)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          py: { xs: 1, md: 2 },
          gap: { xs: 1, md: 3 }
        }}>
          {/* Logo e Menu Hamburger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="start"
                onClick={toggleMobileMenu}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={handleLogoClick}
            >
              <MovieIcon sx={{ 
                mr: 1, 
                color: 'primary.main', 
                fontSize: { xs: 28, md: 32 } 
              }} />
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { sm: '1.8rem', md: '2rem' }
                }}
              >
                Movie
              </Typography>
            </Box>
          </Box>

          {/* Navigation Items - Desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, justifyContent: 'center' }}>
              {getNavItems().map((item) => (
                <Chip
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => navigate(item.path)}
                  variant={location.pathname === item.path ? 'filled' : 'outlined'}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 
                      alpha(theme.palette.primary.main, 0.15) : 'transparent',
                    color: location.pathname === item.path ? 
                      theme.palette.primary.main : theme.palette.text.secondary,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.main,
                    },
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>
          )}

          {/* Search Bar */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '60%', sm: '200px', md: '400px' },
              flexShrink: 0,
            }}
            ref={searchRef}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar filmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 2 && setShowResults(true)}
              inputRef={inputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={clearSearch}
                      sx={{ color: 'text.secondary' }}
                    >
                      <Close />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: 'text.primary',
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  transition: 'all 0.3s ease',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
              }}
            />

            {/* Search Results Dropdown */}
            <Slide direction="down" in={showResults} mountOnEnter unmountOnExit>
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  mt: 1,
                  width: '100%',
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`,
                  zIndex: theme.zIndex.modal,
                  overflow: 'hidden',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  maxHeight: 400,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: 8,
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.background.default, 0.1),
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.4),
                    borderRadius: 4,
                  },
                }}
              >
                {isSearching ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pesquisando...
                    </Typography>
                  </Box>
                ) : searchResults.length > 0 ? (
                  <List sx={{ py: 1 }}>
                    {searchResults.map((movie) => (
                      <MovieSearchCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => handleResultClick(movie.id)}
                      />
                    ))}
                  </List>
                ) : searchQuery.length > 2 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum filme encontrado
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Slide>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Mobile */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MovieIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              LT
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          
          <List>
            {getNavItems().map((item) =>
              item.hasSubmenu ? (
                <Box key={item.path}>
                  <ListItem sx={{ borderRadius: 1, mb: 0.5 }}>
                    <ListItemButton
                      onClick={toggleGenresExpanded}
                      sx={{
                        borderRadius: 1,
                        backgroundColor: location.pathname.startsWith(item.path)
                          ? alpha(theme.palette.primary.main, 0.1)
                          : 'transparent',
                      }}
                    >
                      <ListItemText primary={item.label} />
                      {genresExpanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>

                  {genresExpanded && (
                    <Box sx={{ pl: 3 }}>
                      {genres.map((genre) => (
                        <ListItem key={genre.id} sx={{ borderRadius: 1, mb: 0.5 }}>
                          <ListItemButton
                            onClick={() => handleNavigation(`/genres/${genre.id}`)}
                            sx={{
                              borderRadius: 1,
                              fontSize: '0.9rem',
                              backgroundColor:
                                location.pathname === `/genres/${genre.id}`
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : 'transparent',
                            }}
                          >
                            <ListItemText primary={genre.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <ListItem key={item.path} sx={{ borderRadius: 1, mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 1,
                      backgroundColor:
                        location.pathname === item.path
                          ? alpha(theme.palette.primary.main, 0.1)
                          : 'transparent',
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>

        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;