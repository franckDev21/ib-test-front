import { Bell, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '@/store/dataStore';

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
  showReport?: boolean;
}

export const Header = ({ title, showNotifications = true, showReport = true }: HeaderProps) => {
  const navigate = useNavigate();
  const notifications = useDataStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">IB</span>
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-1">
          {showReport && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/reports')}
            >
              <FileText className="h-5 w-5" />
            </Button>
          )}

          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
