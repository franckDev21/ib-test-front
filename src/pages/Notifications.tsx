import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDataStore } from '@/store/dataStore';
import { EmptyState } from '@/components/shared/EmptyState';
import { Bell, AlertCircle, Info, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const Notifications = () => {
  const { notifications, markNotificationRead } = useDataStore();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urgent':
        return AlertCircle;
      case 'reminder':
        return Clock;
      default:
        return Info;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'text-destructive';
      case 'reminder':
        return 'text-yellow-500';
      default:
        return 'text-primary';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Notifications" showNotifications={false} />
        <EmptyState
          icon={Bell}
          title="Aucune notification"
          description="Vous n'avez pas de notifications pour le moment"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header title="Notifications" showNotifications={false} />

      <main className="max-w-lg mx-auto p-4 space-y-3">
        {notifications.map((notification, index) => {
          const CategoryIcon = getCategoryIcon(notification.category);

          return (
            <Card
              key={notification.id}
              className={cn(
                'cursor-pointer transition-all animate-slide-up',
                !notification.read && 'border-l-4 border-l-primary'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => markNotificationRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      getCategoryColor(notification.category),
                      'bg-muted'
                    )}
                  >
                    <CategoryIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="default" className="text-xs flex-shrink-0">
                          Nouveau
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {format(new Date(notification.date), "d MMMM à HH:mm", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
};

export default Notifications;
