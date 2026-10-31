import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
  Heart,
  UserRound,
} from 'lucide-react';

const items = [
  { label: 'Bosh sahifa', path: '/', icon: Home },
  { label: 'Kashf etish', path: '/discover', icon: Compass },
  { label: 'Qidiruv', path: '/search', icon: Search },
  { label: 'Sevimlilar', path: '/favorites', icon: Heart },
  { label: 'Profil', path: '/profile', icon: UserRound },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#101014]/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={`flex min-w-0 flex-col items-center gap-1 px-2 py-2 text-[10px] transition ${
                active
                  ? 'text-cinema-gold'
                  : 'text-cinema-muted hover:text-white'
              }`}
            >
              <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
