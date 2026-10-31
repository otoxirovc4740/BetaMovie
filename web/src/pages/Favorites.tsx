import { useCallback, useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { api } from '../services/api';

interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  rating?: number | string | null;
}

interface Favorite {
  movie: Movie;
}

export default function Favorites() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = useCallback(() => {
    setLoading(true);
    setError('');

    api.favorites()
      .then((result) => {
        const data = result as Favorite[] | Movie[];
        const list = data.map((item) =>
          'movie' in item ? item.movie : item,
        );
        setMovies(list);
      })
      .catch(() => {
        setError('Sevimli kinolarni yuklashda xatolik yuz berdi.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const removeFavorite = async (movieId: number) => {
    try {
      await api.removeFavorite(movieId);
      setMovies((current) =>
        current.filter((movie) => movie.id !== movieId),
      );
    } catch {
      setError('Kinoni sevimlilardan olib tashlab bo‘lmadi.');
    }
  };

  return (
    <main className="min-h-screen bg-cinema-bg px-5 pb-28 pt-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Sevimlilar</h1>
          <p className="mt-2 text-sm text-cinema-muted">
            Siz saqlab qo‘ygan kinolar
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cinema-gold/10">
          <Heart size={23} className="text-cinema-gold" />
        </div>
      </div>

      {loading ? (
        <p className="py-20 text-center text-cinema-gold">
          Yuklanmoqda...
        </p>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={loadFavorites}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cinema-surface px-5 py-3 text-sm"
          >
            <RefreshCw size={16} />
            Qayta urinish
          </button>
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center">
          <Heart size={44} className="mx-auto text-cinema-muted/60" />
          <h2 className="mt-5 font-bold">Hozircha bo‘sh</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-cinema-muted">
            Siz hali sevimli kinolaringizga hech narsa qo‘shmagansiz.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-5 mt-8 text-sm text-cinema-muted">
            {movies.length} ta saqlangan kino
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            {movies.map((movie) => (
              <div key={movie.id} className="relative">
                <MovieCard movie={movie} />

                <button
                  onClick={() => removeFavorite(movie.id)}
                  aria-label={`${movie.title}ni sevimlilardan olib tashlash`}
                  className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-cinema-gold backdrop-blur"
                >
                  <Heart size={17} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
