import React, { useState } from "react";
import { Box, Typography, Paper, Button, useTheme, alpha } from "@mui/material";
import { PlayArrow, VideocamOff } from "@mui/icons-material";

interface MovieVideoProps {
  tmdbId: number;
}

const MovieVideo: React.FC<MovieVideoProps> = ({ tmdbId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useTheme();

  const fakeVideoUrl = "https://www.example.com/fake-video"; // link fake
  const handlePlay = () => setIsPlaying(true);

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.12)}`,
      }}
    >
      {isPlaying ? (
        <a href={fakeVideoUrl} target="_blank" rel="noopener noreferrer">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: alpha(theme.palette.grey[900], 0.1),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 24,
              color: theme.palette.text.secondary,
            }}
          >
            🎬 Vídeo rodando... (link fake)
          </Box>
        </a>
      ) : (
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            textAlign: "center",
            width: "80%",
            height: "80%",
          }}
        >
          <VideocamOff sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Vídeo não disponível
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Este é um modal fake só para apresentação.
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            color="primary"
            onClick={handlePlay}
          >
            Assistir ao vídeo
          </Button>
        </Paper>
      )}
      <Typography variant="caption" sx={{ mt: 2, color: theme.palette.text.secondary }}>
        TMDB ID: {tmdbId}
      </Typography>
    </Box>
  );
};

export default MovieVideo;
