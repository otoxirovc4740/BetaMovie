import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import MovieDetails from './pages/MovieDetails';
import Player from './pages/Player';
import Admin from './pages/Admin';

import { useTelegram } from './hooks/useTelegram';

function AppLayout() {
  const location = useLocation();
  const { ready, webApp } = useTelegram();

  useEffect(() => {
    ready();
  }, []);

  useEffect(() => {
    if (!webApp?.BackButton) return;

    const showBackButton = location.pathname !== '/';

    if (showBackButton) {
      webApp.BackButton.show();
    } else {
      webApp.BackButton.hide();
    }

    const handleBack = () => {
      window.history.back();
    };

    webApp.BackButton.onClick(handleBack);

    return () => {
      webApp.BackButton.offClick(handleBack);
    };
  }, [location.pathname, webApp]);

  const hideNavigation =
    location.pathname.startsWith('/player/') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-cinema-bg">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNavigation && <BottomNav />}
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}
