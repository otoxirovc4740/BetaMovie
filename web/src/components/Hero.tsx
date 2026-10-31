import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  year: number;
  description?: string | null;
  backdropUrl?: string | null;
  posterUrl: string;
}

interface Props {
  movie: Movie | null;
}

export default function Hero({ movie }: Props) {
  const navigate = useNavigate();

  if (!movie) return null;

  const background = movie.backdropUrl || movie.posterUrl;

  return (
    <section className="relative min-h-[470px] overflow-hidden">
      <img
        src={background}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg/70 to-transparent" />

      <div className="relative flex min-h-[470px] flex-col justify-end px-5 pb-10 pt-24">
        <span className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-cinema-gold">
          NW CINEMA ORIGINAL
        </span>

        <h1 className="max-w-lg text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          {movie.title}
        </h1>

        <p className="mt-3 text-sm text-white/70">{movie.year}</p>

        {movie.description && (
          <p className="mt-3 line-clamp-3 max-w-md text-sm leading-6 text-white/80">
            {movie.description}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 rounded-xl bg-cinema-gold px-5 py-3 text-sm font-bold text-black"
          >
            <Play size={17} fill="currentColor" />
            Tomosha qilish
          </button>

          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
          >
            <Info size={17} />
            Batafsil
          </button>
        </div>
      </div>
    </section>
  );
}
