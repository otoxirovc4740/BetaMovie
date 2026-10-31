import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  rating?: number | string | null;
}

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  return (
    <Link to={`/movie/${movie.id}`} className="group block min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-cinema-surface">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {movie.rating && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/75 px-2 py-1 text-xs font-semibold text-cinema-gold backdrop-blur">
            <Star size={12} fill="currentColor" />
            {Number(movie.rating).toFixed(1)}
          </div>
        )}
      </div>

      <h3 className="mt-2 truncate text-sm font-semibold text-white">
        {movie.title}
      </h3>

      <p className="mt-1 text-xs text-cinema-muted">{movie.year}</p>
    </Link>
  );
}

