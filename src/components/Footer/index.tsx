// src/components/Footer/index.tsx
import { 
  Container, 
  Link, 
  Typography, 
  Box, 
  Stack,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import { 
  GitHub,
  LinkedIn,
  Instagram,
  Email,
  KeyboardArrowUp,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        px: 2,
        backgroundColor: 'grey.900',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.5)}, transparent)`,
        }
      }}
    >
            
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4}>
          {/* Conteúdo principal */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            alignItems={{ xs: 'center', md: 'flex-start' }}
            justifyContent="space-between"
          >
            {/* Informações de copyright */}
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ maxWidth: 400 }}>
              Movie
              <Typography variant="body2" sx={{ opacity: 0.8, textAlign: { xs: 'center', md: 'left' } }}>
                Catálogo de filmes TMDB. 
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} - Todos os direitos reservados
              </Typography>
            </Stack>

            {/* Links sociais */}
            <Stack spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                Conecte-se comigo
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  href="https://github.com/leonanthomaz"
                  target="_blank"
                  aria-label="GitHub"
                  sx={{ 
                    color: 'white',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.black, 0.4),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <GitHub fontSize="medium" />
                </IconButton>
                <IconButton
                  href="https://linkedin.com/in/leonanthomaz"
                  target="_blank"
                  aria-label="LinkedIn"
                  sx={{ 
                    color: 'white',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.black, 0.4),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LinkedIn fontSize="medium" />
                </IconButton>
                <IconButton
                  href="https://instagram.com/leonan.thomaz"
                  target="_blank"
                  aria-label="Instagram"
                  sx={{ 
                      color: 'white',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.black, 0.4),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                >
                  <Instagram fontSize="medium" />
                </IconButton>
                <IconButton
                  href="mailto:contato@leonanthomaz.com"
                  aria-label="Email"
                  sx={{ 
                    color: 'white',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.black, 0.4),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Email fontSize="medium" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          {/* Voltar ao topo */}
          <Stack alignItems="center">
            <Link 
              component="button" 
              onClick={handleScrollToTop}
              sx={{ 
                color: 'inherit', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  color: theme.palette.primary.main
                },
                transition: 'all 0.2s ease'
              }}
            >
              <KeyboardArrowUp sx={{ fontSize: '2rem' }} />
              <Typography variant="caption">
                Voltar ao topo
              </Typography>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;