import { Home, Calendar, Clock, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/dashboard' },
  { icon: Calendar, label: 'Missions', path: '/missions' },
  { icon: Clock, label: 'Pointage', path: '/check-in' },
  { icon: User, label: 'Profil', path: '/profile' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/missions' && location.pathname.startsWith('/missions'));
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full transition-all relative',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
                )}
                <item.icon
                  className={cn(
                    'h-5 w-5 mb-1 transition-all',
                    isActive && 'scale-110'
                  )}
                />
                <span className={cn(
                  'text-xs font-medium transition-all',
                  isActive && 'font-bold'
                )}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
