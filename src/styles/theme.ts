import { createTheme } from '@mui/material/styles';

// Tema principal dark com cores mais organizadas
export const useMuiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Amarelo dourado mais vibrante
      light: '#FFE44D',
      dark: '#FFC400',
      contrastText: '#000000',
    },
    secondary: {
      main: '#2C2C2C', // Cinza escuro
      light: '#404040',
      dark: '#1A1A1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F0F0F', // Quase preto
      paper: '#1E1E1E',   // Cinza muito escuro
    },
    text: {
      primary: '#FFFFFF',   // Branco puro
      secondary: '#B0B0B0', // Cinza claro
      disabled: '#666666',  // Cinza médio
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: '#FFD700',
      hover: 'rgba(255, 215, 0, 0.08)',
      selected: 'rgba(255, 215, 0, 0.16)',
    }
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    h1: { 
      fontSize: '3rem', 
      fontWeight: 700, 
      lineHeight: 1.2,
      color: '#FFD700'
    },
    h2: { 
      fontSize: '2.5rem', 
      fontWeight: 600, 
      lineHeight: 1.3,
      color: '#FFFFFF'
    },
    h3: { 
      fontSize: '2rem', 
      fontWeight: 600, 
      lineHeight: 1.4,
      color: '#FFFFFF'
    },
    h4: { 
      fontSize: '1.5rem', 
      fontWeight: 500,
      color: '#FFFFFF'
    },
    h5: { 
      fontSize: '1.25rem', 
      fontWeight: 500,
      color: '#FFFFFF'
    },
    h6: { 
      fontSize: '1rem', 
      fontWeight: 500,
      color: '#FFFFFF'
    },
    body1: { 
      fontSize: '1rem', 
      fontWeight: 400, 
      lineHeight: 1.6,
      color: '#B0B0B0'
    },
    body2: { 
      fontSize: '0.875rem', 
      fontWeight: 400, 
      lineHeight: 1.5,
      color: '#B0B0B0'
    },
    button: { 
      fontWeight: 600, 
      textTransform: 'none',
      color: '#000000'
    },
  },
  shape: { 
    borderRadius: 12 
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0F0F0F',
          color: '#FFFFFF',
          fontFamily: `'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          padding: '12px 32px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: '#FFD700',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#FFC400',
              boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: '#FFD700',
            color: '#FFD700',
            '&:hover': {
              borderColor: '#FFC400',
              backgroundColor: 'rgba(255, 215, 0, 0.08)',
            },
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 15px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFD700',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        icon: {
          color: '#FFD700',
        },
        iconEmpty: {
          color: '#404040',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#FFD700',
          '&:hover': {
            color: '#FFC400',
          },
        },
      },
    },
  },
});

export default useMuiTheme;