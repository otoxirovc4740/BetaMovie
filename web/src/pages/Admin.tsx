import { useEffect, useState } from 'react';
import {
  Film,
  Users,
  Plus,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

type AdminTab = 'overview' | 'movies' | 'users' | 'settings';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then((result) => {
        const data = result as { isAdmin?: boolean };
        setIsAdmin(Boolean(data.isAdmin));
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: 'overview', label: 'Umumiy', icon: LayoutDashboard },
    { id: 'movies', label: 'Kinolar', icon: Film },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
  ] as const;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cinema-bg text-cinema-gold">
        Tekshirilmoqda...
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cinema-bg px-6 text-center text-white">
        <ShieldAlert size={52} className="text-red-400" />
        <h1 className="mt-5 text-2xl font-bold">Kirish taqiqlangan</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-cinema-muted">
          Ushbu bo‘lim faqat administratorlar uchun.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-xl bg-cinema-gold px-6 py-3 font-bold text-black"
        >
          Bosh sahifaga qaytish
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cinema-bg px-5 pb-12 pt-7 text-white">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate('/profile')}
          aria-label="Profilga qaytish"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cinema-surface"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cinema-gold">
            NW CINEMA
          </p>
          <h1 className="text-2xl font-extrabold">Admin panel</h1>
        </div>
      </header>

      <nav className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold ${
              activeTab === id
                ? 'bg-cinema-gold text-black'
                : 'bg-cinema-surface text-cinema-muted'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Boshqaruv markazi</h2>
          <div className="mt-5 rounded-2xl border border-white/10 bg-cinema-surface p-5">
            <LayoutDashboard size={28} className="text-cinema-gold" />
            <h3 className="mt-4 font-bold">NW CINEMA statistikasi</h3>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              Platforma statistikasi backend admin API yaratilgandan keyin ulanadi.
            </p>
          </div>
        </section>
      )}

      {activeTab === 'movies' && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Kino boshqaruvi</h2>
          <div className="mt-5 rounded-2xl border border-white/10 bg-cinema-surface p-5">
            <Film size={28} className="text-cinema-gold" />
            <h3 className="mt-4 font-bold">Kino katalogi</h3>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              Kinolarni qo‘shish, tahrirlash va o‘chirish imkoniyatlari keyingi bosqichda ulanadi.
            </p>
            <button
              disabled
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cinema-gold/30 py-3 text-sm font-bold text-white/50"
            >
              <Plus size={17} /> Yangi kino qo‘shish
            </button>
          </div>
        </section>
      )}

      {activeTab === 'users' && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Foydalanuvchilar</h2>
          <div className="mt-5 rounded-2xl border border-white/10 bg-cinema-surface p-5">
            <Users size={28} className="text-cinema-gold" />
            <h3 className="mt-4 font-bold">Foydalanuvchilar bazasi</h3>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              Foydalanuvchilar ro‘yxati va boshqaruvi keyingi bosqichda ulanadi.
            </p>
          </div>
        </section>
      )}

      {activeTab === 'settings' && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Platforma sozlamalari</h2>
          <div className="mt-5 rounded-2xl border border-white/10 bg-cinema-surface p-5">
            <Settings size={28} className="text-cinema-gold" />
            <h3 className="mt-4 font-bold">NW CINEMA sozlamalari</h3>
            <p className="mt-2 text-sm leading-6 text-cinema-muted">
              Umumiy sozlamalar keyingi bosqichda ulanadi.
            </p>
          </div>
        </section>
      )}

      <footer className="mt-12 text-center text-xs text-cinema-muted">
        NW CINEMA ADMIN © 2026
      </footer>
    </main>
  );
}
