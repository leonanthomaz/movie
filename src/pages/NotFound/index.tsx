import React from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
        p: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Efeitos de fundo decorativos */}
      <Box sx={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        zIndex: 0
      }} />

      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={4}
        sx={{
          maxWidth: 600,
          width: '100%',
          zIndex: 1,
          textAlign: 'center',
          p: 4,
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Ícone/Emoji decorativo */}
        <Box
          sx={{
            fontSize: '4rem',
            mb: 2,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateY(0)'
              },
              '40%': {
                transform: 'translateY(-20px)'
              },
              '60%': {
                transform: 'translateY(-10px)'
              }
            }
          }}
        >
          🚧
        </Box>

        <Typography 
          variant="h1"
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            fontSize: { xs: '3rem', md: '4rem' },
            mb: 1
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4"
          sx={{ 
            color: theme.palette.text.primary,
            fontWeight: 600,
            mb: 2
          }}
        >
          Página não encontrada
        </Typography>
        
        <Typography 
          variant="body1"
          sx={{ 
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: '400px',
            lineHeight: 1.6
          }}
        >
          A página que você está procurando não existe ou foi movida. 
          Verifique o URL ou volte para a página inicial.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: theme.palette.primary.contrastText,
            boxShadow: '0 4px 15px rgba(255, 235, 59, 0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(255, 235, 59, 0.4)',
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            }
          }}
        >
          Voltar à página anterior
        </Button>
      </Stack>

      {/* Footer minimalista */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          textAlign: 'center',
          width: '100%',
          color: theme.palette.text.secondary,
          fontSize: '0.875rem',
          opacity: 0.6
        }}
      >
        © {new Date().getFullYear()} Sandbox • Página não encontrada
      </Box>
    </Box>
  );
};

export default NotFound;