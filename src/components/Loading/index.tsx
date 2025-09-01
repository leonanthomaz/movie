import { Box, Typography, keyframes, useTheme, useMediaQuery } from '@mui/material';
import { MovieCreation, Theaters, CameraRoll } from '@mui/icons-material';
import { CgClapperBoard } from 'react-icons/cg';

// Animações para dar vida ao componente
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
`;

const Loading = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                color: 'white',
            }}
        >
            {/* Ícone principal de carregamento: bobina de filme girando */}
            <CameraRoll 
                sx={{
                    fontSize: isMobile ? 80 : 120,
                    color: '#FFD700',
                    animation: `${rotate} 2s linear infinite`,
                    mb: 3,
                }}
            />

            {/* Ícones de apoio animados */}
            <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, mb: 3 }}>
                <Theaters 
                    sx={{ 
                        fontSize: isMobile ? 40 : 60, 
                        color: '#E0E0E0',
                        animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                />
                {/* AQUI ESTÁ A CORREÇÃO: troquei ClapperBoard por CgClapperBoard */}
                <CgClapperBoard 
                    style={{
                        fontSize: isMobile ? '40px' : '60px',
                        color: '#E0E0E0',
                        animation: `${pulse} 2.5s ease-in-out infinite`,
                    }}
                />
                <MovieCreation
                    sx={{ 
                        fontSize: isMobile ? 40 : 60, 
                        color: '#E0E0E0',
                        animation: `${pulse} 3s ease-in-out infinite`,
                    }}
                />
            </Box>

            {/* Mensagem de carregamento */}
            <Typography variant={isMobile ? "h6" : "h4"} sx={{ mt: 4, fontWeight: 700, textAlign: 'center', textShadow: '2px 2px 4px #000' }}>
                Preparando a tela grande...
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: '#B0B0B0' }}>
                Sua sessão está prestes a começar.
            </Typography>
        </Box>
    );
};

export default Loading;