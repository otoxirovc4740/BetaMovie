import { useEffect, useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { api } from '../services/api';

interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  rating?: number | string | null;
}

interface SearchResult {
  items: Movie[];
  total: number;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const value = query.trim();

    if (value.length < 2) {
      setMovies([]);
      setLoading(false);
      setSearched(false);
      setError('');
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(() => {
      setLoading(true);
      setError('');

      api.search(value)
        .then((result) => {
          if (cancelled) return;

          const data = result as SearchResult;
          setMovies(data.items || []);
          setSearched(true);
        })
        .catch(() => {
          if (cancelled) return;

          setMovies([]);
          setError('Qidiruvda xatolik yuz berdi.');
          setSearched(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return (
    <main className="min-h-screen bg-cinema-bg px-5 pb-28 pt-8 text-white">
      <h1 className="text-3xl font-extrabold">Qidiruv</h1>

      <p className="mt-2 text-sm text-cinema-muted">
        Sevimli kinongizni tezda toping
      </p>

      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-cinema-surface px-4 py-3 focus-within:border-cinema-gold/60">
        <SearchIcon size={20} className="shrink-0 text-cinema-muted" />

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Kino nomini kiriting..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-cinema-muted"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Qidiruvni tozalash"
            className="rounded-full p-1 text-cinema-muted transition hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {query.trim().length === 1 && (
        <p className="mt-5 text-center text-sm text-cinema-muted">
          Qidirish uchun yana kamida bitta belgi kiriting.
        </p>
      )}

      {loading && (
        <p className="py-12 text-center text-sm text-cinema-gold">
          Kinolar qidirilmoqda...
        </p>
      )}

      {!loading && error && (
        <p className="py-12 text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && searched && movies.length === 0 && (
        <div className="py-16 text-center">
          <SearchIcon size={36} className="mx-auto text-cinema-muted" />
          <p className="mt-4 font-semibold">Kino topilmadi</p>
          <p className="mt-2 text-sm text-cinema-muted">
            Boshqa nom bilan qidirib ko‘ring.
          </p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="mb-5 mt-7 flex items-center justify-between">
            <h2 className="font-bold">Qidiruv natijalari</h2>
            <span className="text-xs text-cinema-muted">
              {movies.length} ta natija
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {!loading && !searched && query.length === 0 && (
        <div className="py-20 text-center">
          <SearchIcon size={42} className="mx-auto text-cinema-muted/60" />
          <p className="mt-4 font-semibold">Kino qidirishni boshlang</p>
          <p className="mt-2 text-sm text-cinema-muted">
            Kino nomini yuqoridagi maydonga yozing.
          </p>
        </div>
      )}
    </main>
  );
}
