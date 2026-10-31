import { Navigate, Route, Routes } from 'react-router-dom';

function Home() {
  return (
    <main className="min-h-screen bg-cinema-bg text-cinema-text">
      <header className="flex items-center justify-between px-5 py-5">
        <h1 className="text-2xl font-extrabold tracking-tight">
          NW <span className="text-cinema-gold">CINEMA</span>
        </h1>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm">
          Profil
        </button>
      </header>

      <section className="px-5 pb-8 pt-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cinema-gold">
          Your cinema experience
        </p>
        <h2 className="max-w-md text-4xl font-extrabold leading-tight sm:text-6xl">
          Kino olamiga xush kelibsiz.
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-cinema-muted">
          Sevimli filmlaringiz, yangi premyeralar va unutilmas hikoyalar bir joyda.
        </p>
        <button className="mt-7 rounded-xl bg-cinema-gold px-6 py-3 font-bold text-black transition hover:brightness-110">
          Kinolarni ko‘rish
        </button>
      </section>

      <section className="px-5 py-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold">Kashf eting</h3>
          <span className="text-sm text-cinema-gold">Barchasi →</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {['Trending', 'Yangi kinolar', 'Mashhurlar', 'Tavsiya etiladi'].map(
            (item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-cinema-surface p-5"
              >
                <div className="mb-4 h-16 rounded-xl bg-gradient-to-br from-cinema-gold/30 to-transparent" />
                <p className="font-semibold">{item}</p>
              </div>
            ),
          )}
        </div>
      </section>

      <footer className="px-5 py-8 text-center text-xs text-cinema-muted">
        NW CINEMA © 2026
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
