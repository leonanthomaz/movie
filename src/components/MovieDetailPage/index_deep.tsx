// // src/components/MovieDetailPage.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Typography,
//   Stack,
//   Chip,
//   Button,
//   IconButton,
//   Card,
//   CardContent,
//   alpha,
//   useTheme,
//   Skeleton,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogContent,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress
// } from '@mui/material';
// import {
//   Star,
//   CalendarToday,
//   AccessTime,
//   Language,
//   Group,
//   Movie as MovieIcon,
//   ArrowBack,
//   PlayArrow,
//   Theaters,
//   Tv,
//   Subtitles,
//   VolumeUp,
//   Download
// } from '@mui/icons-material';
// import { moviesApi } from '../../services/api/movies';
// import { tvApi } from '../../services/api/tv';
// import type { Movie, MovieDetails, Cast, Crew, TVShowDetails, Season, Episode } from '../../types/movie';
// import { useGlobal } from '../../context/GlobalContext';
// import Navbar from '../../components/Navbar';
// import Footer from '../../components/Footer';
// import { serverApi } from '../../services/api/server';
// import { mediaApi } from '../../services/api/media';

// interface RecommendedMovies {
//   results: Movie[];
// }

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`movie-tabpanel-${index}`}
//       aria-labelledby={`movie-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// const MovieDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const [movie, setMovie] = useState<MovieDetails | null>(null);
//   const [tvShow, setTvShow] = useState<TVShowDetails | null>(null);
//   const [credits, setCredits] = useState<{ cast: Cast[], crew: Crew[] } | null>(null);
//   const [recommended, setRecommended] = useState<RecommendedMovies | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const { isLoading, setIsLoading } = useGlobal();
//   const [embedUrl, setEmbedUrl] = useState<string | null>(null);
//   const [tabValue, setTabValue] = useState(0);
//   const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
//   const [selectedSeason, setSelectedSeason] = useState(1);
//   const [selectedEpisode, setSelectedEpisode] = useState(1);
//   const [audioLanguage, setAudioLanguage] = useState('pt');
//   const [subtitleLanguage, setSubtitleLanguage] = useState('pt');
//   const [seasons, setSeasons] = useState<Season[]>([]);
//   const [episodes, setEpisodes] = useState<Episode[]>([]);
//   const [loadingEmbed, setLoadingEmbed] = useState(false);

//   // Verificar se é filme ou série
//   const isTV = window.location.pathname.includes('/tv/');

//   const fetchTVData = useCallback(async (tvId: string | number) => {
//     if (!tvId) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const [detailsRes, recommendationsRes, seasonsRes] = await Promise.all([
//         tvApi.getDetails(Number(tvId)),
//         tvApi.getRecommendations(Number(tvId)),
//         tvApi.getSeasons(Number(tvId))
//       ]);
      
//       setTvShow(detailsRes.data);
//       setCredits(detailsRes.data.credits);
//       setRecommended(recommendationsRes.data);
//       setSeasons(seasonsRes.data.seasons.filter((season: Season) => season.season_number > 0));
      
//       // Carregar episódios da primeira temporada
//       if (seasonsRes.data.seasons.length > 0) {
//         const firstSeason = seasonsRes.data.seasons[0];
//         const episodesRes = await tvApi.getEpisodes(Number(tvId), firstSeason.season_number);
//         setEpisodes(episodesRes.data.episodes);
//         setSelectedSeason(firstSeason.season_number);
//       }
      
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (err) {
//       console.error("Erro ao carregar os dados da série:", err);
//       setError('Não foi possível carregar os detalhes da série.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [setIsLoading]);

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

//   useEffect(() => {
//     if (id) {
//       if (isTV) {
//         fetchTVData(id);
//       } else {
//         fetchMovieData(id);
//       }
//     }
//   }, [id, isTV, fetchTVData, fetchMovieData]);

//   const fetchEmbed = useCallback(async () => {
//     if (!id) return;
    
//     setLoadingEmbed(true);
//     try {
//       let data;
      
//       if (isTV && tvShow) {
//         data = await mediaApi.getEmbed({
//           tmdbId: tvShow.id,
//           type: "tv",
//           season: selectedSeason,
//           episode: selectedEpisode,
//           ds_lang: audioLanguage,
//           sub_url: subtitleLanguage !== 'none' ? `https://example.com/subs/${tvShow.id}_s${selectedSeason}e${selectedEpisode}_${subtitleLanguage}.vtt` : undefined
//         });
//       } else if (movie) {
//         data = await mediaApi.getEmbed({
//           tmdbId: movie.id,
//           type: "movie",
//           ds_lang: audioLanguage,
//           sub_url: subtitleLanguage !== 'none' ? `https://example.com/subs/${movie.id}_${subtitleLanguage}.vtt` : undefined
//         });
//       }
      
//       if (data && data.status === "ok" && data.player_url) {
//         setEmbedUrl(data.player_url);
//         setPlayerDialogOpen(true);
//       } else {
//         setError('Não foi possível carregar o player de vídeo.');
//       }
//     } catch (err) {
//       console.error("Erro ao pegar embed:", err);
//       setError('Erro ao carregar o player de vídeo.');
//     } finally {
//       setLoadingEmbed(false);
//     }
//   }, [id, isTV, movie, tvShow, selectedSeason, selectedEpisode, audioLanguage, subtitleLanguage]);

//   const handleSeasonChange = async (seasonNumber: number) => {
//     setSelectedSeason(seasonNumber);
//     setSelectedEpisode(1);
    
//     try {
//       const episodesRes = await tvApi.getEpisodes(Number(id), seasonNumber);
//       setEpisodes(episodesRes.data.episodes);
//     } catch (err) {
//       console.error("Erro ao carregar episódios:", err);
//       setError('Não foi possível carregar os episódios.');
//     }
//   };

//   const handleCardClick = (mediaId: number, isTv: boolean = false) => {
//     navigate(isTv ? `/tv/${mediaId}` : `/movie/${mediaId}`);
//   };

//   if (error) {
//     return (
//       <Box sx={{ textAlign: 'center', p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//         <Navbar />
//         <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <Typography variant="h5" color="error">{error}</Typography>
//         </Box>
//         <Footer />
//       </Box>
//     );
//   }

//   const media = isTV ? tvShow : movie;
//   const title = isTV ? (tvShow?.name || '') : (movie?.title || '');
//   const backdropUrl = media?.backdrop_path
//     ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
//     : 'https://via.placeholder.com/1920x1080/1E1E1E/FFD700?text=No+Backdrop+Image';
    
//   const posterUrl = media?.poster_path
//     ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
//     : 'https://via.placeholder.com/300x450/1E1E1E/FFD700?text=No+Image';

//   if (isLoading && !media) {
//     return (
//       <Box sx={{ background: theme.palette.background.default, minHeight: '100vh' }}>
//         <Navbar />
//         <Container maxWidth="lg" sx={{ pt: 4 }}>
//           <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2, mb: 4 }} />
//           <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
//             <Skeleton variant="rectangular" width={300} height={450} sx={{ borderRadius: 2 }} />
//             <Box sx={{ flexGrow: 1 }}>
//               <Skeleton variant="text" height={80} sx={{ mb: 2 }} />
//               <Skeleton variant="text" height={40} sx={{ mb: 4 }} />
//               <Skeleton variant="text" height={25} sx={{ mb: 1 }} />
//               <Skeleton variant="text" height={25} sx={{ mb: 1 }} />
//               <Skeleton variant="text" height={25} sx={{ mb: 1 }} />
//               <Skeleton variant="text" height={25} sx={{ mb: 4 }} />
//               <Skeleton variant="rectangular" width={200} height={50} sx={{ borderRadius: 2 }} />
//             </Box>
//           </Box>
//         </Container>
//         <Footer />
//       </Box>
//     );
//   }

//   if (!media) {
//     return null;
//   }

//   const PersonCard = ({ person }: { person: Cast | Crew }) => {
//     const profileUrl = person.profile_path
//       ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
//       : 'https://via.placeholder.com/200x300/1E1E1E/B0B0B0?text=Sem+Foto';
      
//     return (
//       <Card 
//         sx={{ 
//           height: '100%',
//           background: theme.palette.background.paper,
//           border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//           transition: 'all 0.3s ease',
//           '&:hover': {
//             transform: 'translateY(-8px)',
//             boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`,
//             border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
//           }
//         }}
//       >
//         <Box
//           component="img"
//           src={profileUrl}
//           alt={person.name}
//           sx={{ 
//             width: '100%', 
//             height: 240, 
//             objectFit: 'cover',
//             borderTopLeftRadius: '8px',
//             borderTopRightRadius: '8px'
//           }}
//         />
//         <CardContent sx={{ p: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
//             {person.name}
//           </Typography>
//           {('character' in person) && (
//             <Typography variant="caption" sx={{ color: theme.palette.text.secondary, lineHeight: 1.2 }}>
//               {person.character}
//             </Typography>
//           )}
//           {('job' in person) && (
//             <Typography variant="caption" sx={{ color: theme.palette.text.secondary, lineHeight: 1.2 }}>
//               {person.job}
//             </Typography>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };
  
//   const MediaRecommendationCard = ({ media, isTv }: { media: Movie, isTv: boolean }) => {
//     const recommendationPosterUrl = media.poster_path
//       ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
//       : 'https://via.placeholder.com/300x450/1E1E1E/FFD700?text=Sem+Imagem';
      
//     return (
//       <Card 
//         onClick={() => handleCardClick(media.id, isTv)}
//         sx={{ 
//           width: { xs: 160, sm: 180, md: 200 },
//           flexShrink: 0,
//           background: theme.palette.background.paper,
//           border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//           cursor: 'pointer',
//           transition: 'all 0.3s ease',
//           '&:hover': {
//             transform: 'translateY(-8px)',
//             boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`,
//             border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
//           }
//         }}
//       >
//         <Box
//           component="img"
//           src={recommendationPosterUrl}
//           alt={isTv ? media.name : media.title}
//           sx={{ 
//             width: '100%', 
//             height: 260, 
//             objectFit: 'cover',
//             borderTopLeftRadius: '8px',
//             borderTopRightRadius: '8px'
//           }}
//         />
//         <CardContent sx={{ p: 1.5 }}>
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               fontWeight: 600, 
//               color: theme.palette.text.primary,
//               display: '-webkit-box',
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: 'vertical',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               lineHeight: 1.3
//             }}
//           >
//             {isTv ? media.name : media.title}
//           </Typography>
//           <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
//             {isTv ? 'Série' : 'Filme'}
//           </Typography>
//         </CardContent>
//       </Card>
//     );
//   };

//   const EpisodeCard = ({ episode }: { episode: Episode }) => {
//     const episodeThumbUrl = episode.still_path
//       ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
//       : 'https://via.placeholder.com/300x169/1E1E1E/B0B0B0?text=Sem+Imagem';
      
//     return (
//       <Card 
//         sx={{ 
//           background: theme.palette.background.paper,
//           border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//           transition: 'all 0.3s ease',
//           cursor: 'pointer',
//           '&:hover': {
//             transform: 'translateY(-4px)',
//             boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
//           }
//         }}
//         onClick={() => {
//           setSelectedEpisode(episode.episode_number);
//           setTimeout(fetchEmbed, 100);
//         }}
//       >
//         <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
//           <Box
//             component="img"
//             src={episodeThumbUrl}
//             alt={episode.name}
//             sx={{ 
//               width: { xs: '100%', sm: 160 },
//               height: { xs: 120, sm: 90 },
//               objectFit: 'cover'
//             }}
//           />
//           <Box sx={{ p: 2, flexGrow: 1 }}>
//             <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
//               Episódio {episode.episode_number}: {episode.name}
//             </Typography>
//             <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
//               {episode.overview || 'Sinopse não disponível.'}
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//               <Chip 
//                 icon={<CalendarToday sx={{ fontSize: 16 }} />} 
//                 label={new Date(episode.air_date || '').toLocaleDateString('pt-BR')} 
//                 size="small"
//                 sx={{ mr: 1 }}
//               />
//               <Chip 
//                 icon={<AccessTime sx={{ fontSize: 16 }} />} 
//                 label={`${episode.runtime || 'N/A'} min`} 
//                 size="small"
//               />
//             </Box>
//           </Box>
//         </Box>
//       </Card>
//     );
//   };

//   return (
//     <Box sx={{ background: theme.palette.background.default, minHeight: '100vh' }}>
//       <Navbar />
      
//       {/* Hero Section with Backdrop */}
//       <Box
//         sx={{
//           position: 'relative',
//           minHeight: { xs: 'auto', md: '70vh' },
//           overflow: 'hidden',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.2)} 0%, ${theme.palette.background.default} 90%), url(${backdropUrl})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             filter: 'blur(4px)',
//             transform: 'scale(1.05)',
//           },
//         }}
//       >
//         <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
//           <IconButton
//             onClick={() => navigate(-1)}
//             sx={{
//               position: 'absolute',
//               top: { xs: 18, md: 24 },
//               left: { xs: 22, md: 0 },
//               color: theme.palette.primary.main,
//               backgroundColor: alpha(theme.palette.background.paper, 0.8),
//               backdropFilter: 'blur(10px)',
//               '&:hover': {
//                 backgroundColor: alpha(theme.palette.primary.main, 0.1),
//               },
//               zIndex: 1
//             }}
//           >
//             <ArrowBack />
//           </IconButton>
          
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'center', md: 'flex-start' },
//               gap: 4,
//               textAlign: { xs: 'center', md: 'left' }
//             }}
//           >
//             {/* Poster */}
//             <Box
//               sx={{
//                 width: { xs: '70%', sm: '50%', md: '35%' },
//                 maxWidth: 400,
//                 flexShrink: 0,
//                 display: 'flex',
//                 justifyContent: 'center',
//                 position: 'relative',
//                 '&:hover .play-overlay': {
//                   opacity: 1,
//                 }
//               }}
//             >
//               <Box
//                 component="img"
//                 src={posterUrl}
//                 alt={title}
//                 sx={{
//                   width: '100%',
//                   height: 'auto',
//                   borderRadius: 3,
//                   boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
//                   border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//                 }}
//               />
//               <Box
//                 className="play-overlay"
//                 sx={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   backgroundColor: alpha(theme.palette.background.default, 0.7),
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   borderRadius: 3,
//                   opacity: 0,
//                   transition: 'opacity 0.3s ease',
//                   cursor: 'pointer'
//                 }}
//                 onClick={fetchEmbed}
//               >
//                 <PlayArrow sx={{ fontSize: 60, color: theme.palette.primary.main }} />
//               </Box>
//             </Box>

//             {/* Media Details */}
//             <Box sx={{ color: theme.palette.text.primary, width: { xs: '100%', md: '65%' } }}>
//               <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
//                 <Typography 
//                   variant="h2" 
//                   component="h1" 
//                   sx={{ 
//                     fontWeight: 800, 
//                     color: theme.palette.primary.main,
//                     fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
//                     textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
//                   }}
//                 >
//                   {title}
//                 </Typography>
//                 <Chip
//                   icon={<Star sx={{ color: theme.palette.primary.main }} />}
//                   label={media.vote_average.toFixed(1)}
//                   sx={{ 
//                     backgroundColor: alpha(theme.palette.primary.main, 0.15), 
//                     color: theme.palette.primary.main, 
//                     fontWeight: 700, 
//                     fontSize: '1rem',
//                     height: 36
//                   }}
//                 />
//                 {isTV && (
//                   <Chip
//                     icon={<Tv sx={{ color: theme.palette.info.main }} />}
//                     label="Série"
//                     sx={{ 
//                       backgroundColor: alpha(theme.palette.info.main, 0.15), 
//                       color: theme.palette.info.main, 
//                       fontWeight: 700 
//                     }}
//                   />
//                 )}
//               </Stack>
              
//               {media.tagline && (
//                 <Typography variant="h6" sx={{ mb: 3, fontStyle: 'italic', color: theme.palette.text.secondary }}>
//                   {media.tagline}
//                 </Typography>
//               )}
              
//               <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
//                 {media.release_date && (
//                   <Chip 
//                     icon={<CalendarToday sx={{ color: theme.palette.text.secondary }} />} 
//                     label={`${new Date(media.release_date).getFullYear()}`} 
//                     sx={{ 
//                       backgroundColor: alpha(theme.palette.secondary.main, 0.2), 
//                       color: theme.palette.text.primary 
//                     }} 
//                   />
//                 )}
//                 {'runtime' in media && media.runtime && (
//                   <Chip 
//                     icon={<AccessTime sx={{ color: theme.palette.text.secondary }} />} 
//                     label={`${media.runtime} min`} 
//                     sx={{ 
//                       backgroundColor: alpha(theme.palette.secondary.main, 0.2), 
//                       color: theme.palette.text.primary 
//                     }} 
//                   />
//                 )}
//                 {media.original_language && (
//                   <Chip 
//                     icon={<Language sx={{ color: theme.palette.text.secondary }} />} 
//                     label={media.original_language.toUpperCase()} 
//                     sx={{ 
//                       backgroundColor: alpha(theme.palette.secondary.main, 0.2), 
//                       color: theme.palette.text.primary 
//                     }} 
//                   />
//                 )}
//                 {isTV && tvShow && (
//                   <Chip 
//                     icon={<Tv sx={{ color: theme.palette.text.secondary }} />} 
//                     label={`${tvShow.number_of_seasons} temporada(s)`} 
//                     sx={{ 
//                       backgroundColor: alpha(theme.palette.secondary.main, 0.2), 
//                       color: theme.palette.text.primary 
//                     }} 
//                   />
//                 )}
//               </Stack>
              
//               <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}>
//                 {media.genres?.map(genre => (
//                   <Chip
//                     key={genre.id}
//                     label={genre.name}
//                     sx={{ 
//                       backgroundColor: alpha(theme.palette.primary.main, 0.15), 
//                       color: theme.palette.primary.main, 
//                       fontWeight: 500 
//                     }}
//                   />
//                 ))}
//               </Stack>
              
//               <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: theme.palette.text.primary }}>
//                 {media.overview}
//               </Typography>
              
//               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
//                 <Button
//                   onClick={fetchEmbed}
//                   disabled={loadingEmbed}
//                   variant="contained"
//                   startIcon={loadingEmbed ? <CircularProgress size={20} /> : <Theaters />}
//                   sx={{
//                     py: 1.5,
//                     px: 3,
//                     background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                     color: theme.palette.primary.contrastText,
//                     fontWeight: 700,
//                     borderRadius: 2,
//                     boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
//                     '&:hover': {
//                       boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
//                       transform: 'translateY(-2px)',
//                     }
//                   }}
//                 >
//                   {loadingEmbed ? 'Carregando...' : `Assistir ${isTV ? 'Série' : 'Filme'}`}
//                 </Button>

//                 {/* Botão de download (apenas para filmes) */}
//                 {!isTV && (
//                   <Button
//                     variant="outlined"
//                     startIcon={<Download />}
//                     sx={{
//                       py: 1.5,
//                       px: 3,
//                       fontWeight: 700,
//                       borderRadius: 2,
//                       borderWidth: 2,
//                       '&:hover': {
//                         borderWidth: 2,
//                         transform: 'translateY(-2px)',
//                       }
//                     }}
//                   >
//                     Download
//                   </Button>
//                 )}
//               </Stack>

//               {/* Opções de áudio e legenda (apenas para filmes) */}
//               {!isTV && (
//                 <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
//                   <FormControl sx={{ minWidth: 120 }} size="small">
//                     <InputLabel id="audio-label">Áudio</InputLabel>
//                     <Select
//                       labelId="audio-label"
//                       value={audioLanguage}
//                       label="Áudio"
//                       onChange={(e) => setAudioLanguage(e.target.value)}
//                       startAdornment={<VolumeUp sx={{ color: 'text.secondary', mr: 1 }} />}
//                     >
//                       <MenuItem value="pt">Português</MenuItem>
//                       <MenuItem value="en">Inglês</MenuItem>
//                       <MenuItem value="es">Espanhol</MenuItem>
//                     </Select>
//                   </FormControl>

//                   <FormControl sx={{ minWidth: 120 }} size="small">
//                     <InputLabel id="subtitle-label">Legenda</InputLabel>
//                     <Select
//                       labelId="subtitle-label"
//                       value={subtitleLanguage}
//                       label="Legenda"
//                       onChange={(e) => setSubtitleLanguage(e.target.value)}
//                       startAdornment={<Subtitles sx={{ color: 'text.secondary', mr: 1 }} />}
//                     >
//                       <MenuItem value="none">Nenhuma</MenuItem>
//                       <MenuItem value="pt">Português</MenuItem>
//                       <MenuItem value="en">Inglês</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </Container>
//       </Box>

//       {/* Content Sections */}
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         {/* Tabs para séries */}
//         {isTV && (
//           <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
//             <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
//               <Tab label="Episódios" />
//               <Tab label="Elenco" />
//               <Tab label="Temporadas" />
//             </Tabs>
//           </Box>
//         )}

//         {/* Painel de Episódios (apenas para séries) */}
//         {isTV && (
//           <TabPanel value={tabValue} index={0}>
//             <Box sx={{ mb: 4 }}>
//               <FormControl sx={{ minWidth: 120, mb: 3 }}>
//                 <InputLabel id="season-select-label">Temporada</InputLabel>
//                 <Select
//                   labelId="season-select-label"
//                   value={selectedSeason}
//                   label="Temporada"
//                   onChange={(e) => handleSeasonChange(Number(e.target.value))}
//                 >
//                   {seasons.map((season) => (
//                     <MenuItem key={season.id} value={season.season_number}>
//                       Temporada {season.season_number}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                 {episodes.map((episode) => (
//                   <EpisodeCard key={episode.id} episode={episode} />
//                 ))}
//               </Box>
//             </Box>
//           </TabPanel>
//         )}

//         {/* Painel de Elenco */}
//         <TabPanel value={isTV ? tabValue : 0} index={isTV ? 1 : 0}>
//           {credits && credits.cast.length > 0 && (
//             <Box sx={{ mb: 8 }}>
//               <Typography 
//                 variant="h4" 
//                 component="h2" 
//                 sx={{ 
//                   fontWeight: 700, 
//                   mb: 4, 
//                   display: 'flex', 
//                   alignItems: 'center',
//                   color: theme.palette.text.primary
//                 }}
//               >
//                 <Group sx={{ mr: 1.5, color: theme.palette.primary.main }} /> 
//                 Elenco Principal
//               </Typography>
//               <Box sx={{ 
//                 display: 'flex',
//                 gap: 3,
//                 overflowX: 'auto',
//                 pb: 2,
//                 '&::-webkit-scrollbar': {
//                   height: 8,
//                 },
//                 '&::-webkit-scrollbar-track': {
//                   backgroundColor: alpha(theme.palette.secondary.main, 0.1),
//                   borderRadius: 4,
//                 },
//                 '&::-webkit-scrollbar-thumb': {
//                   backgroundColor: alpha(theme.palette.primary.main, 0.4),
//                   borderRadius: 4,
//                   '&:hover': {
//                     backgroundColor: alpha(theme.palette.primary.main, 0.6),
//                   }
//                 }
//               }}>
//                 {credits.cast.slice(0, 10).map((person) => (
//                   <Box key={person.id} sx={{ flexShrink: 0, width: { xs: 150, sm: 180, md: 200 } }}>
//                     <PersonCard person={person} />
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           )}
//         </TabPanel>

//         {/* Painel de Temporadas (apenas para séries) */}
//         {isTV && (
//           <TabPanel value={tabValue} index={2}>
//             <Typography 
//               variant="h4" 
//               component="h2" 
//               sx={{ 
//                 fontWeight: 700, 
//                 mb: 4, 
//                 display: 'flex', 
//                 alignItems: 'center',
//                 color: theme.palette.text.primary
//               }}
//             >
//               <Tv sx={{ mr: 1.5, color: theme.palette.primary.main }} /> 
//               Temporadas
//             </Typography>
//             <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
//               {seasons.map((season) => (
//                 <Card 
//                   key={season.id}
//                   sx={{ 
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       transform: 'translateY(-8px)',
//                       boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`,
//                     }
//                   }}
//                   onClick={() => {
//                     setTabValue(0);
//                     handleSeasonChange(season.season_number);
//                   }}
//                 >
//                   <Box
//                     component="img"
//                     src={season.poster_path ? `https://image.tmdb.org/t/p/w300${season.poster_path}` : posterUrl}
//                     alt={`Temporada ${season.season_number}`}
//                     sx={{ 
//                       width: '100%', 
//                       height: 200, 
//                       objectFit: 'cover'
//                     }}
//                   />
//                   <CardContent>
//                     <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                       Temporada {season.season_number}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
//                       {season.episode_count} episódios
//                     </Typography>
//                     {season.air_date && (
//                       <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                         {new Date(season.air_date).getFullYear()}
//                       </Typography>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))}
//             </Box>
//           </TabPanel>
//         )}
        
//         {/* Recommended Media Section */}
//         {recommended && recommended.results.length > 0 && (
//           <Box>
//             <Typography 
//               variant="h4" 
//               component="h2" 
//               sx={{ 
//                 fontWeight: 700, 
//                 mb: 4, 
//                 display: 'flex', 
//                 alignItems: 'center',
//                 color: theme.palette.text.primary
//               }}
//             >
//               <MovieIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} /> 
//               {isTV ? 'Séries Recomendadas' : 'Filmes Recomendados'}
//             </Typography>
//             <Box sx={{ 
//               display: 'flex',
//               gap: 3,
//               overflowX: 'auto',
//               pb: 2,
//               '&::-webkit-scrollbar': {
//                 height: 8,
//               },
//               '&::-webkit-scrollbar-track': {
//                 backgroundColor: alpha(theme.palette.secondary.main, 0.1),
//                 borderRadius: 4,
//               },
//               '&::-webkit-scrollbar-thumb': {
//                 backgroundColor: alpha(theme.palette.primary.main, 0.4),
//                 borderRadius: 4,
//                 '&:hover': {
//                   backgroundColor: alpha(theme.palette.primary.main, 0.6),
//                 }
//               }
//             }}>
//               {recommended.results.slice(0, 10).map((recMedia) => (
//                 <MediaRecommendationCard key={recMedia.id} media={recMedia} isTv={isTV} />
//               ))}
//             </Box>
//           </Box>
//         )}
//       </Container>

//       {/* Dialog do Player */}
//       <Dialog 
//         open={playerDialogOpen} 
//         onClose={() => setPlayerDialogOpen(false)}
//         maxWidth="lg"
//         fullWidth
//         sx={{ 
//           '& .MuiDialog-paper': { 
//             backgroundColor: 'transparent',
//             boxShadow: 'none',
//             overflow: 'hidden'
//           } 
//         }}
//       >
//         <DialogContent sx={{ p: 0, backgroundColor: 'black' }}>
//           {embedUrl ? (
//             <iframe
//               src={embedUrl}
//               style={{ width: '100%', height: '70vh', border: 'none' }}
//               allowFullScreen
//               allow="autoplay; encrypted-media"
//             />
//           ) : (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//               <CircularProgress />
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>
      
//       <Footer />
//     </Box>
//   );
// };

// export default MovieDetailPage;