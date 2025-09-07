// src/routes/AppRouter.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MovieDetailPage from '../pages/MovieDetailPage';
import MainPortal from '../pages/MainPortal';
import MovieGenresPage from '../pages/MovieGenresPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/movie" element={<MainPortal />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="/genres/:genreId" element={<MovieGenresPage />} />
    </Routes>
  );
};

export default AppRouter;