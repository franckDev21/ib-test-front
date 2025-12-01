import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataStore, GeoLocation } from '@/store/dataStore';
import { Clock, LogIn, LogOut, Pause, Play, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import CheckInMap from '@/components/CheckInMap';

const CheckIn = () => {
  const { currentStatus, checkIn, checkOut, togglePause, checkIns } = useDataStore();
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);

  const todayCheckIns = checkIns.filter(record => 
    isSameDay(new Date(record.date), new Date())
  );

  const handleLocationUpdate = useCallback((lat: number, lng: number, address: string) => {
    setCurrentLocation({ lat, lng, address });
  }, []);

  const handleCheckIn = () => {
    if (todayCheckIns.length >= 2) {
      toast.error('Limite atteinte : maximum 2 pointages par jour');
      return;
    }
    checkIn(currentLocation || undefined);
    toast.success('Pointage d\'arrivée enregistré avec localisation');
  };

  const handleCheckOut = () => {
    checkOut(currentLocation || undefined);
    toast.success('Pointage de départ enregistré');
  };

  const handleTogglePause = () => {
    togglePause();
    toast.info(currentStatus === 'pause' ? 'Reprise du travail' : 'Pause commencée');
  };

  const getStatusInfo = () => {
    switch (currentStatus) {
      case 'present':
        return {
          label: 'Présent',
          color: 'bg-green-500',
          icon: Play,
        };
      case 'pause':
        return {
          label: 'En pause',
          color: 'bg-yellow-500',
          icon: Pause,
        };
      case 'absent':
        return {
          label: 'Absent',
          color: 'bg-muted',
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Pointage" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* Current Date */}
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-1 capitalize">
            {format(new Date(), 'EEEE', { locale: fr })}
          </h2>
          <p className="text-muted-foreground">
            {format(new Date(), 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        {/* Geolocation Map */}
        <div className="animate-fade-in">
          <CheckInMap onLocationUpdate={handleLocationUpdate} />
          {currentLocation && (
            <p className="text-xs text-muted-foreground mt-2 text-center truncate px-4">
              <MapPin className="h-3 w-3 inline mr-1" />
              {currentLocation.address}
            </p>
          )}
        </div>

        {/* Status Display */}
        <Card className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div
                className={`w-24 h-24 mx-auto rounded-full ${statusInfo.color} flex items-center justify-center animate-pulse-slow`}
              >
                <StatusIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{statusInfo.label}</h2>
            <p className="text-muted-foreground">
              {format(new Date(), 'HH:mm:ss')}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 animate-slide-up">
          {currentStatus === 'absent' && (
            <Button
              size="lg"
              className="w-full h-14"
              onClick={handleCheckIn}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Pointer l'arrivée
            </Button>
          )}

          {currentStatus !== 'absent' && (
            <>
              <Button
                size="lg"
                variant="secondary"
                className="w-full h-14"
                onClick={handleTogglePause}
              >
                {currentStatus === 'pause' ? (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Reprendre le travail
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Commencer une pause
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full h-14"
                onClick={handleCheckOut}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Pointer le départ
              </Button>
            </>
          )}
        </div>

        {/* History */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Historique récent
          </h3>
          
          {checkIns.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Aucun pointage enregistré aujourd'hui
              </CardContent>
            </Card>
          ) : (
            checkIns.map((record) => (
              <Card key={record.id} className="animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{format(new Date(record.date), 'dd/MM/yyyy')}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                        <span>Arrivée: <span className="text-foreground font-medium">{record.checkIn}</span></span>
                        <span>Départ: <span className="text-foreground font-medium">{record.checkOut || '-'}</span></span>
                        {record.pauseStart && record.pauseEnd && (
                          <span className="col-span-2">
                            Pause: <span className="text-foreground font-medium">{record.pauseDuration}</span>
                            <span className="text-xs ml-1">(de {record.pauseStart} à {record.pauseEnd})</span>
                          </span>
                        )}
                      </div>
                      {record.checkInLocation && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-green-500" />
                          <span className="truncate">{record.checkInLocation.address}</span>
                        </p>
                      )}
                      {record.duration && (
                        <p className="text-sm mt-2 pt-2 border-t border-border">
                          Durée totale: <span className="text-primary font-semibold">{record.duration}</span>
                        </p>
                      )}
                    </div>
                    <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                      {record.status === 'completed' ? 'Terminé' : 'En cours'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CheckIn;
