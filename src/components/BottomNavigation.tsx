import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  icon: string;
  label: string;
  path: string;
  activeIcon?: string;
}

const navItems: NavItem[] = [
  { icon: 'home', label: 'Home', path: '/dashboard', activeIcon: 'home' },
  {
    icon: 'account_balance_wallet',
    label: 'Transações',
    path: '/transactions',
    activeIcon: 'account_balance_wallet',
  },
  { icon: 'potted_plant', label: 'Metas', path: '/goals' },
  { icon: 'bar_chart', label: 'Análises', path: '/statistics' },
  { icon: 'settings', label: 'Ajustes', path: '/settings' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 pb-safe bg-surface/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(46,125,50,0.05)] rounded-t-xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 duration-200 ${
              isActive
                ? 'bg-secondary-container rounded-full text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined"
              {...(isActive ? { style: { fontVariationSettings: "'FILL' 1" } } : {})}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
