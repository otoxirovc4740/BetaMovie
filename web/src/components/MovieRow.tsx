import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  rating?: number | string | null;
}

interface Props {
  title: string;
  movies: Movie[];
  link?: string;
}

export default function MovieRow({ title, movies, link }: Props) {
  if (!movies.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-lg font-bold text-white">{title}</h2>

        {link && (
          <Link
            to={link}
            className="flex items-center gap-1 text-xs text-cinema-gold"
          >
            Barchasi <ChevronRight size={15} />
          </Link>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {movies.map((movie) => (
          <div key={movie.id} className="w-[125px] flex-none sm:w-[150px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
