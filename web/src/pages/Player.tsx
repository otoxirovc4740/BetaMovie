import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Maximize, PlayCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface Movie {
  id: number;
  title: string;
  watchUrl?: string | null;
  posterUrl?: string | null;
}

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      setError('Film identifikatori noto‘g‘ri.');
      setLoading(false);
      return;
    }

    api.movie(Number(id))
      .then((result) => {
        setMovie(result as Movie);
      })
      .catch(() => {
        setError('Film ma’lumotlarini yuklab bo‘lmadi.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const openFullscreen = () => {
    const video = document.querySelector<HTMLVideoElement>('#cinema-player');

    if (video?.requestFullscreen) {
      void video.requestFullscreen();
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-cinema-gold">
        Player yuklanmoqda...
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-5 text-center text-white">
        <AlertCircle size={42} className="text-red-400" />
        <p className="mt-4">{error || 'Film topilmadi.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl bg-cinema-surface px-5 py-3 text-sm"
        >
          Orqaga qaytish
        </button>
      </main>
    );
  }

  const watchUrl = movie.watchUrl?.trim() || '';

  const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(watchUrl);
  const isHls = /\.m3u8(\?.*)?$/i.test(watchUrl);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Orqaga"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-cinema-muted">NW CINEMA PLAYER</p>
          <h1 className="truncate font-bold">{movie.title}</h1>
        </div>

        <button
          onClick={openFullscreen}
          aria-label="To‘liq ekran"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
        >
          <Maximize size={18} />
        </button>
      </header>

      <section className="flex min-h-[55vh] items-center justify-center bg-[#08080b]">
        {isDirectVideo ? (
          <video
            id="cinema-player"
            className="aspect-video w-full bg-black"
            controls
            playsInline
            poster={movie.posterUrl || undefined}
            preload="metadata"
          >
            <source src={watchUrl} />
            Brauzeringiz video formatini qo‘llab-quvvatlamaydi.
          </video>
        ) : isHls ? (
          <div className="mx-5 max-w-md text-center">
            <PlayCircle size={48} className="mx-auto text-cinema-gold" />
            <h2 className="mt-4 text-lg font-bold">HLS video manbasi</h2>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              HLS (.m3u8) ijrosi uchun keyingi bosqichda mos video player
              kutubxonasi ulanadi.
            </p>
          </div>
        ) : watchUrl ? (
          <div className="mx-5 max-w-md text-center">
            <PlayCircle size={48} className="mx-auto text-cinema-gold" />
            <h2 className="mt-4 text-lg font-bold">Tashqi video manbasi</h2>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              Ushbu manba to‘g‘ridan-to‘g‘ri video fayl emas.
              Uni qo‘llab-quvvatlash uchun alohida embed integratsiyasi kerak.
            </p>
          </div>
        ) : (
          <div className="px-6 text-center">
            <AlertCircle size={42} className="mx-auto text-cinema-muted" />
            <h2 className="mt-4 text-lg font-bold">
              Video hozircha mavjud emas
            </h2>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              Ushbu film uchun video manbasi hali administrator tomonidan
              qo‘shilmagan.
            </p>
          </div>
        )}
      </section>

      <section className="px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cinema-gold">
          Hozir tomosha qilinmoqda
        </p>
        <h2 className="mt-2 text-xl font-bold">{movie.title}</h2>
        <p className="mt-3 text-sm leading-6 text-cinema-muted">
          NW CINEMA — kino tomosha qilish platformasi.
        </p>
      </section>
    </main>
  );
}
