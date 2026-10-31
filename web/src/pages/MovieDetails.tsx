import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Play,
  Star,
  Clock,
  Calendar,
  Globe,
} from 'lucide-react';
import { api } from '../services/api';

interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  backdropUrl?: string | null;
  description?: string | null;
  rating?: number | string | null;
  duration?: number | null;
  country?: string | null;
  trailerUrl?: string | null;
  genres?: Array<{
    id: number;
    nameUz: string;
  }>;
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      setError('Kino identifikatori noto‘g‘ri.');
      setLoading(false);
      return;
    }

    Promise.all([
      api.movie(Number(id)),
      api.favorites(),
    ])
      .then(([movieResult, favoritesResult]) => {
        const data = movieResult as Movie;
        setMovie(data);

        const favorites = favoritesResult as Array<{
          id?: number;
          movieId?: number;
          movie?: { id: number };
        }>;

        setIsFavorite(
          favorites.some((item) =>
            item.movie?.id === data.id ||
            item.movieId === data.id ||
            item.id === data.id,
          ),
        );
      })
      .catch(() => {
        setError('Kino ma’lumotlarini yuklab bo‘lmadi.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFavorite = async () => {
    if (!movie || favoriteLoading) return;

    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        await api.removeFavorite(movie.id);
        setIsFavorite(false);
      } else {
        await api.addFavorite(movie.id);
        setIsFavorite(true);
      }
    } catch {
      setError('Sevimlilarni yangilashda xatolik yuz berdi.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cinema-bg text-cinema-gold">
        Yuklanmoqda...
      </main>
    );
  }

  if (error && !movie) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cinema-bg px-5 text-center text-white">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl bg-cinema-surface px-5 py-3 text-sm"
        >
          Orqaga qaytish
        </button>
      </main>
    );
  }

  if (!movie) return null;

  const background = movie.backdropUrl || movie.posterUrl;

  return (
    <main className="min-h-screen bg-cinema-bg pb-28 text-white">
      <section className="relative min-h-[390px] overflow-hidden">
        <img
          src={background}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-black/40 to-black/30" />

        <button
          onClick={() => navigate(-1)}
          aria-label="Orqaga"
          className="absolute left-5 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur"
        >
          <ArrowLeft size={21} />
        </button>

        <div className="relative flex min-h-[390px] items-end px-5 pb-7">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-cinema-gold">
              NW CINEMA
            </p>
            <h1 className="max-w-lg text-3xl font-extrabold sm:text-4xl">
              {movie.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="px-5 pt-5">
        <div className="flex flex-wrap items-center gap-4 text-xs text-cinema-muted">
          <span className="flex items-center gap-1">
            <Calendar size={15} />
            {movie.year}
          </span>

          {movie.duration && (
            <span className="flex items-center gap-1">
              <Clock size={15} />
              {movie.duration} daqiqa
            </span>
          )}

          {movie.country && (
            <span className="flex items-center gap-1">
              <Globe size={15} />
              {movie.country}
            </span>
          )}

          {movie.rating && (
            <span className="flex items-center gap-1 font-bold text-cinema-gold">
              <Star size={15} fill="currentColor" />
              {Number(movie.rating).toFixed(1)}
            </span>
          )}
        </div>

        {movie.genres && movie.genres.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full border border-white/10 bg-cinema-surface px-3 py-2 text-xs text-white/80"
              >
                {genre.nameUz}
              </span>
            ))}
          </div>
        )}

        <div className="mt-7 flex gap-3">
          <button
            onClick={() => navigate(`/player/${movie.id}`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cinema-gold px-5 py-3.5 text-sm font-bold text-black transition hover:brightness-110"
          >
            <Play size={18} fill="currentColor" />
            Tomosha qilish
          </button>

          <button
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            aria-label="Sevimlilarga qo‘shish yoki olib tashlash"
            className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
              isFavorite
                ? 'border-cinema-gold bg-cinema-gold/10 text-cinema-gold'
                : 'border-white/10 bg-cinema-surface text-white'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-9">
          <h2 className="text-lg font-bold">Film haqida</h2>
          <p className="mt-3 text-sm leading-7 text-cinema-muted">
            {movie.description || 'Film tavsifi hozircha mavjud emas.'}
          </p>
        </div>

        {movie.trailerUrl && (
          <button
            onClick={() => window.open(movie.trailerUrl!, '_blank', 'noopener,noreferrer')}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-cinema-surface py-3 text-sm font-semibold"
          >
            <Play size={17} />
            Treylerni ko‘rish
          </button>
        )}
      </section>
    </main>
  );
}
