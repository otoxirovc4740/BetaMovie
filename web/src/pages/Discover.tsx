import { useEffect, useState } from 'react';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';

interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  rating?: number | string | null;
}

interface Genre {
  id: number;
  slug: string;
  nameUz: string;
}

interface MovieResult {
  items: Movie[];
  total: number;
}

export default function Discover() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('new');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.genres()
      .then((result) => setGenres(result as Genre[]))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      sort,
      page: '1',
      limit: '40',
    });

    if (genre) params.set('genre', genre);

    api.movies(`?${params.toString()}`)
      .then((result) => {
        setMovies((result as MovieResult).items);
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [genre, sort]);

  return (
    <main className="min-h-screen bg-cinema-bg px-5 pb-28 pt-8 text-white">
      <h1 className="text-3xl font-extrabold">Kashf etish</h1>
      <p className="mt-2 text-sm text-cinema-muted">
        O‘zingizga yoqqan kinolarni toping
      </p>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-3">
        <button
          onClick={() => setGenre('')}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
            !genre ? 'bg-cinema-gold text-black' : 'bg-cinema-surface text-white'
          }`}
        >
          Barchasi
        </button>

        {genres.map((item) => (
          <button
            key={item.id}
            onClick={() => setGenre(item.slug)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              genre === item.slug
                ? 'bg-cinema-gold text-black'
                : 'bg-cinema-surface text-white'
            }`}
          >
            {item.nameUz}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-bold">Kinolar katalogi</h2>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-lg border border-white/10 bg-cinema-surface px-3 py-2 text-xs text-white"
        >
          <option value="new">Yangi</option>
          <option value="year">Yil bo‘yicha</option>
          <option value="popular">Mashhur</option>
        </select>
      </div>

      {loading ? (
        <p className="py-16 text-center text-cinema-muted">Yuklanmoqda...</p>
      ) : movies.length === 0 ? (
        <p className="py-16 text-center text-cinema-muted">
          Hozircha kinolar mavjud emas.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}
