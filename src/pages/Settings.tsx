import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Moon } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header title="Paramètres" showNotifications={false} />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    Mode sombre
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Activé par défaut
                  </p>
                </div>
              </div>
              <Switch id="dark-mode" checked={darkMode} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recevoir les alertes
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">À propos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Application</span>
              <span className="font-medium text-foreground">IchBin Employés</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
