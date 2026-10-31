import { useEffect, useState } from 'react';
import {
  UserRound, Moon, Sun, Globe, ShieldCheck, LogOut, ChevronRight,
} from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { api } from '../services/api';

interface UserProfile {
  firstName?: string | null;
  username?: string | null;
  theme?: 'dark' | 'light';
}

interface MeResponse {
  user?: UserProfile;
  isAdmin?: boolean;
  favoritesCount?: number;
}

export default function Profile() {
  const { user, webApp, isTelegram } = useTelegram();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.me()
      .then((result) => {
        const data = result as MeResponse;
        setProfile(data.user ?? null);
        setIsAdmin(Boolean(data.isAdmin));

        if (data.user?.theme) {
          setTheme(data.user.theme);
        }
      })
      .catch(() => setError('Profil ma’lumotlarini yuklab bo‘lmadi.'))
      .finally(() => setLoading(false));
  }, []);

  const changeTheme = async (nextTheme: 'dark' | 'light') => {
    const previousTheme = theme;
    setTheme(nextTheme);
    setSaving(true);
    setError('');

    try {
      await api.updateProfile({ theme: nextTheme });
      document.documentElement.dataset.theme = nextTheme;
    } catch {
      setTheme(previousTheme);
      setError('Mavzuni saqlashda xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const firstName = profile?.firstName || user?.first_name || 'Foydalanuvchi';
  const username = profile?.username || user?.username || '';
  const initials = firstName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cinema-bg text-cinema-gold">
        Profil yuklanmoqda...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cinema-bg px-5 pb-28 pt-8 text-white">
      <h1 className="text-3xl font-extrabold">Profil</h1>
      <p className="mt-2 text-sm text-cinema-muted">
        Shaxsiy ma’lumotlar va sozlamalar
      </p>

      <section className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-cinema-surface p-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cinema-gold text-2xl font-extrabold text-black">
          {user?.photo_url ? (
            <img src={user.photo_url} alt={firstName} className="h-full w-full object-cover" />
          ) : initials}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold">{firstName}</h2>
          {username && <p className="mt-1 truncate text-sm text-cinema-muted">@{username}</p>}
          <p className="mt-2 text-xs text-cinema-gold">NW CINEMA foydalanuvchisi</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-cinema-muted">Ko‘rinish</h2>
        <div className="rounded-2xl border border-white/10 bg-cinema-surface p-4">
          <div className="flex items-center gap-3">
            {theme === 'dark'
              ? <Moon size={19} className="text-cinema-gold" />
              : <Sun size={19} className="text-cinema-gold" />}
            <div className="flex-1">
              <p className="font-semibold">Mavzu</p>
              <p className="mt-1 text-xs text-cinema-muted">Ilova ko‘rinishini tanlang</p>
            </div>
            <div className="flex rounded-xl bg-black/30 p-1">
              <button onClick={() => changeTheme('dark')} disabled={saving}
                aria-label="Qorong‘i mavzu"
                className={`rounded-lg p-2 ${theme === 'dark' ? 'bg-cinema-gold text-black' : 'text-cinema-muted'}`}>
                <Moon size={17} />
              </button>
              <button onClick={() => changeTheme('light')} disabled={saving}
                aria-label="Yorug‘ mavzu"
                className={`rounded-lg p-2 ${theme === 'light' ? 'bg-cinema-gold text-black' : 'text-cinema-muted'}`}>
                <Sun size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-cinema-muted">Ilova haqida</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-cinema-surface">
          <div className="flex items-center gap-3 border-b border-white/5 p-4">
            <Globe size={19} className="text-cinema-gold" />
            <div className="flex-1">
              <p className="font-semibold">Til</p>
              <p className="mt-1 text-xs text-cinema-muted">O‘zbek tili</p>
            </div>
            <ChevronRight size={18} className="text-cinema-muted" />
          </div>
          <div className="flex items-center gap-3 p-4">
            <ShieldCheck size={19} className="text-cinema-gold" />
            <div className="flex-1">
              <p className="font-semibold">Xavfsizlik</p>
              <p className="mt-1 text-xs text-cinema-muted">Telegram orqali himoyalangan kirish</p>
            </div>
          </div>
        </div>
      </section>

      {isAdmin && (
        <button onClick={() => window.location.assign('/admin')}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-cinema-gold/20 bg-cinema-gold/10 p-4 text-left">
          <ShieldCheck size={20} className="text-cinema-gold" />
          <span className="flex-1 font-semibold">Admin panel</span>
          <ChevronRight size={18} />
        </button>
      )}

      {error && <p className="mt-5 text-center text-sm text-red-400">{error}</p>}

      <section className="mt-8 rounded-2xl border border-white/10 bg-cinema-surface p-4">
        <div className="flex items-center gap-3">
          <UserRound size={19} className="text-cinema-gold" />
          <div>
            <p className="font-semibold">NW CINEMA</p>
            <p className="mt-1 text-xs text-cinema-muted">Versiya 1.0.0</p>
          </div>
        </div>
      </section>

      {isTelegram && (
        <button onClick={() => webApp?.close()}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-cinema-muted">
          <LogOut size={17} /> Ilovani yopish
        </button>
      )}

      <footer className="py-8 text-center text-xs text-cinema-muted">NW CINEMA © 2026</footer>
    </main>
  );
}
