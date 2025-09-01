// // src/components/MovieDetailPage.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box, Container, Typography, Stack, Chip, Button, IconButton, Card, CardContent, alpha, useTheme, Skeleton
// } from '@mui/material';
// import { Star, CalendarToday, AccessTime, Language, Group, Movie as MovieIcon, ArrowBack, PlayArrow, Theaters } from '@mui/icons-material';
// import { moviesApi } from '../../services/api/movies';
// import { mediaApi } from '../../services/api/server';
// import type { Movie, MovieDetails, Cast, Crew } from '../../types/movie';
// import { useGlobal } from '../../context/GlobalContext';
// import Navbar from '../../components/Navbar';
// import Footer from '../../components/Footer';

// interface RecommendedMovies { results: Movie[] }

// const MovieDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const { isLoading, setIsLoading } = useGlobal();

//   const [movie, setMovie] = useState<MovieDetails | null>(null);
//   const [credits, setCredits] = useState<{ cast: Cast[], crew: Crew[] } | null>(null);
//   const [recommended, setRecommended] = useState<RecommendedMovies | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [embedUrl, setEmbedUrl] = useState<string | null>(null);

//   // Função turbo de buscar embed
//   const fetchEmbed = useCallback(async () => {
//     if (!movie) return;
//     try {
//       let embedData;
//       if (movie.number_of_seasons) {
//         // Série: pega primeiro episódio ou o selecionado
//         embedData = await mediaApi.getEmbed({
//           tmdbId: movie.id,
//           type: "tv",
//           season: 1,
//           episode: 1,
//           ds_lang: "pt", // pode adicionar logica pra dublado
//           autoplay: 1,
//           autonext: 1,
//         });
//       } else {
//         // Filme
//         embedData = await mediaApi.getEmbed({
//           tmdbId: movie.id,
//           type: "movie",
//           ds_lang: "pt",
//           autoplay: 1,
//         });
//       }

//       if (embedData.status === "ok" && embedData.player_url) {
//         setEmbedUrl(embedData.player_url);
//       }
//     } catch (err) {
//       console.error("Erro ao pegar embed:", err);
//     }
//   }, [movie]);

//   const fetchMovieData = useCallback(async (movieId: string | number) => {
//     if (!movieId) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const [detailsRes, recommendationsRes] = await Promise.all([
//         moviesApi.getDetails(Number(movieId)),
//         moviesApi.getRecommendations(Number(movieId))
//       ]);
//       setMovie(detailsRes.data);
//       setCredits(detailsRes.data.credits);
//       setRecommended(recommendationsRes.data);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (err) {
//       console.error("Erro ao carregar os dados do filme:", err);
//       setError('Não foi possível carregar os detalhes do filme.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [setIsLoading]);

//   useEffect(() => { if (id) fetchMovieData(id); }, [id, fetchMovieData]);
//   useEffect(() => { fetchEmbed(); }, [fetchEmbed]);

//   if (error) return <Box sx={{ textAlign: 'center', p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}><Navbar /><Typography variant="h5" color="error">{error}</Typography><Footer /></Box>;
//   if (isLoading && !movie) return <Box sx={{ background: theme.palette.background.default, minHeight: '100vh' }}><Navbar /><Container maxWidth="lg"><Skeleton variant="rectangular" width="100%" height={400} /></Container><Footer /></Box>;
//   if (!movie) return null;

//   const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'https://via.placeholder.com/1920x1080/1E1E1E/FFD700?text=No+Backdrop';
//   const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/1E1E1E/FFD700?text=No+Image';

//   const PersonCard = ({ person }: { person: Cast | Crew }) => {
//     const profileUrl = person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x300/1E1E1E/B0B0B0?text=Sem+Foto';
//     return (
//       <Card sx={{ height: '100%', background: theme.palette.background.paper, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` } }}>
//         <Box component="img" src={profileUrl} alt={person.name} sx={{ width: '100%', height: 240, objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
//         <CardContent sx={{ p: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>{person.name}</Typography>
//           {'character' in person ? <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>{person.character}</Typography> : null}
//           {'job' in person ? <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>{person.job}</Typography> : null}
//         </CardContent>
//       </Card>
//     );
//   };

//   const MovieRecommendationCard = ({ movie }: { movie: Movie }) => {
//     const recommendationPosterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/1E1E1E/FFD700?text=Sem+Imagem';
//     return (
//       <Card onClick={() => navigate(`/movie/${movie.id}`)} sx={{ width: { xs: 160, sm: 180, md: 200 }, flexShrink: 0, background: theme.palette.background.paper, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` } }}>
//         <Box component="img" src={recommendationPosterUrl} alt={movie.title} sx={{ width: '100%', height: 260, objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
//         <CardContent sx={{ p: 1.5 }}>
//           <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</Typography>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <Box sx={{ background: theme.palette.background.default, minHeight: '100vh' }}>
//       <Navbar />

//       {/* Hero Section */}
//       <Box sx={{ position: 'relative', minHeight: { xs: 'auto', md: '70vh' }, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.2)} 0%, ${theme.palette.background.default} 90%), url(${backdropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(4px)', transform: 'scale(1.05)' } }}>
//         <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
//           <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: { xs: 18, md: 24 }, left: { xs: 22, md: 0 }, color: theme.palette.primary.main, backgroundColor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(10px)', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }, zIndex: 1 }}><ArrowBack /></IconButton>

//           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 4, textAlign: { xs: 'center', md: 'left' } }}>
//             {/* Poster com overlay de play */}
//             <Box sx={{ width: { xs: '70%', sm: '50%', md: '35%' }, maxWidth: 400, flexShrink: 0, display: 'flex', justifyContent: 'center', position: 'relative', '&:hover .play-overlay': { opacity: 1 } }}>
//               <Box component="img" src={posterUrl} alt={movie.title} sx={{ width: '100%', height: 'auto', borderRadius: 3, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}` }} />
//               <Box className="play-overlay" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: alpha(theme.palette.background.default, 0.7), display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3, opacity: 0, transition: 'opacity 0.3s ease', cursor: 'pointer' }}>
//                 <PlayArrow sx={{ fontSize: 60, color: theme.palette.primary.main }} />
//               </Box>
//             </Box>

//             {/* Details */}
//             <Box sx={{ color: theme.palette.text.primary, width: { xs: '100%', md: '65%' } }}>
//               <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
//                 <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: theme.palette.primary.main, fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{movie.title}</Typography>
//                 <Chip icon={<Star sx={{ color: theme.palette.primary.main }} />} label={movie.vote_average.toFixed(1)} sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.15), color: theme.palette.primary.main, fontWeight: 700, fontSize: '1rem', height: 36 }} />
//               </Stack>

//               <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: theme.palette.text.primary }}>{movie.overview}</Typography>

//               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
//                 <Button component="a" href={embedUrl || "#"} target="_blank" rel="noopener noreferrer" disabled={!embedUrl} variant="contained" startIcon={<Theaters />} sx={{ py: 1.5, px: 3, background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: theme.palette.primary.contrastText, fontWeight: 700, borderRadius: 2, boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`, '&:hover': { boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`, transform: 'translateY(-2px)' } }}>Assistir Filme</Button>
//               </Stack>
//             </Box>
//           </Box>
//         </Container>
//       </Box>

//       {/* Cast */}
//       {credits && credits.cast.length > 0 && (
//         <Container maxWidth="lg" sx={{ py: 8 }}>
//           <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}><Group sx={{ mr: 1.5, color: theme.palette.primary.main }} />Elenco Principal</Typography>
//           <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
//             {credits.cast.slice(0, 10).map(person => <PersonCard key={person.id} person={person} />)}
//           </Box>
//         </Container>
//       )}

//       {/* Recomendações */}
//       {recommended && recommended.results.length > 0 && (
//         <Container maxWidth="lg" sx={{ py: 8 }}>
//           <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}><MovieIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />Filmes Recomendados</Typography>
//           <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
//             {recommended.results.slice(0, 10).map(rec => <MovieRecommendationCard key={rec.id} movie={rec} />)}
//           </Box>
//         </Container>
//       )}

//       <Footer />
//     </Box>
//   );
// };

// export default MovieDetailPage;
