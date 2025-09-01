// src/components/MovieTorrentDownload.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Download } from '@mui/icons-material';

interface TorrentProps {
    movieTitle: string;
}

const MovieTorrentDownload: React.FC<TorrentProps> = ({ movieTitle }) => {
    // You can replace this with a real torrent search/download logic
    const handleDownloadClick = () => {
        const query = encodeURIComponent(movieTitle + ' torrent');
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };

    return (
        <Box sx={{ my: 4 }}>
            <Box
                sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'rgba(255, 215, 0, 0.05)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Baixar {movieTitle} via Torrent
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleDownloadClick}
                    sx={{
                        background: 'linear-gradient(45deg, #FFD700 30%, #FFC400 90%)',
                        color: 'black',
                        fontWeight: 700,
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
                        },
                    }}
                >
                    Baixar Agora
                </Button>
            </Box>
        </Box>
    );
};

export default MovieTorrentDownload;