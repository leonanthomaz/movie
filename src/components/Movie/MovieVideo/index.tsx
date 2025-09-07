import React from "react";
import { Box, Typography } from "@mui/material";

interface MovieVideoProps {
  videos?: { results: any[] };
}

const MovieVideo: React.FC<MovieVideoProps> = ({ videos }) => {
  if (!videos || !videos.results.length) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Nenhum trailer disponível</Typography>
      </Box>
    );
  }

  // pega o primeiro trailer do YouTube
  const trailer = videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  if (!trailer) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Nenhum trailer disponível</Typography>
      </Box>
    );
  }

  const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`;

  return (
    <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        src={youtubeUrl}
        title={trailer.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "0",
        }}
      />
    </Box>
  );
};

export default MovieVideo;
