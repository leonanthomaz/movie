// src/styles/globalStyles.tsx
import { GlobalStyles } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const GlobalCss = () => (
  <GlobalStyles
    styles={(theme) => ({
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: theme.palette.background.default,
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        lineHeight: 1.6,
        color: theme.palette.text.primary,
      },
      a: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
        transition: 'all 0.2s ease',
        fontWeight: 500,
        '&:hover': {
          color: theme.palette.primary.dark,
        },
      },
      ul: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        listStylePosition: 'inside',
      },
      img: {
        maxWidth: '100%',
        display: 'block',
        borderRadius: '8px',
      },
      'h1, h2, h3, h4, h5, h6': {
        marginTop: '2rem',
        marginBottom: '1rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      'p, li': {
        marginBottom: '1rem',
      },
      blockquote: {
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        paddingLeft: '1.5rem',
        marginLeft: 0,
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        padding: '1.5rem',
        borderRadius: '0 12px 12px 0',
        margin: '2rem 0',
      },
      '::selection': {
        backgroundColor: alpha(theme.palette.primary.main, 0.15),
        color: theme.palette.text.primary,
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f3f5',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#ced4da',
        borderRadius: '4px',
        '&:hover': {
          background: '#adb5bd',
        },
      },
      '.syntax-highlighter': {
        borderRadius: '12px !important',
        padding: '1.5rem !important',
        margin: '1.5rem 0 !important',
        fontSize: '0.9rem !important',
        backgroundColor: `${theme.palette.background.default} !important`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)} !important`,
      },
      '.blog-content': {
        '& img': {
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
          margin: '2rem 0',
          border: `1px solid ${alpha('#e9ecef', 0.8)}`,
        },
        '& h2': {
          paddingBottom: '0.5rem',
          borderBottom: `2px solid ${alpha('#e9ecef', 0.8)}`,
          marginTop: '3rem',
        },
        '& h3': {
          marginTop: '2.5rem',
        },
        '& ul, & ol': {
          paddingLeft: '1.5rem',
          marginBottom: '1.5rem',
        },
        '& li': {
          marginBottom: '0.5rem',
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${alpha('#e9ecef', 0.8)}`,
        },
        '& th, & td': {
          padding: '0.75rem',
          border: `1px solid ${alpha('#e9ecef', 0.8)}`,
        },
        '& th': {
          backgroundColor: '#f8f9fa',
          fontWeight: 600,
        },
        '& tr:nth-of-type(even)': {
          backgroundColor: '#f8f9fa',
        },
      },
    })}
  />
);