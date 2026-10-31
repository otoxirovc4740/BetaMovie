
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
  Heart,
  UserRound,
} from 'lucide-react';

const navigation = [
  { label: 'Bosh sahifa', path: '/', icon: Home },
  { label: 'Kashf', path: '/discover', icon: Compass },
  { label: 'Qidiruv', path: '/search', icon: Search },
  { label: 'Sevimlilar', path: '/favorites', icon: Heart },
  { label: 'Profil', path: '/profile', icon: UserRound },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#101014]/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 text-[10px] transition ${
                isActive
                  ? 'text-cinema-gold'
                  : 'text-cinema-muted hover:text-white'
              }`
            }
          >
            <Icon size={21} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
