import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { api } from '../services/api';

interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  backdropUrl?: string | null;
  description?: string | null;
  rating?: number | string | null;
}

interface HomeData {
  featured: Movie | null;
  trending: Movie[];
  recentlyAdded: Movie[];
  popular: Movie[];
  recommended: Movie[];
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.home()
      .then((result) => setData(result as HomeData))
      .catch(() => setError('Kinolarni yuklashda xatolik yuz berdi.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cinema-bg text-cinema-gold">
        NW CINEMA
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cinema-bg px-5 text-center text-white">
        {error || 'Ma’lumot topilmadi.'}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cinema-bg pb-24 text-cinema-text">
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5">
        <h1 className="text-xl font-extrabold tracking-tight">
          NW <span className="text-cinema-gold">CINEMA</span>
        </h1>
        <button
          onClick={() => window.location.assign('/profile')}
          className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs text-white backdrop-blur"
        >
          Profil
        </button>
      </header>

      <Hero movie={data.featured} />

      <div className="mt-7 space-y-7">
        <MovieRow title="Trendda" movies={data.trending} />
        <MovieRow title="Yangi qo‘shilgan" movies={data.recentlyAdded} />
        <MovieRow title="Mashhur kinolar" movies={data.popular} />
        <MovieRow title="Siz uchun" movies={data.recommended} />
      </div>

      <footer className="px-5 py-8 text-center text-xs text-cinema-muted">
        NW CINEMA © 2026
      </footer>
    </main>
  );
}
