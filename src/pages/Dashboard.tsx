import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { Clock, Calendar, TrendingUp, Award, ArrowRight, AlertTriangle, FileText, MessageSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { performance, shifts, currentStatus } = useDataStore();

  const nextShift = shifts.find((s) => s.status === 'ongoing' || s.status === 'upcoming');

  const getStatusBadge = () => {
    const variants = {
      present: { label: 'Présent', variant: 'default' as const },
      pause: { label: 'En pause', variant: 'secondary' as const },
      absent: { label: 'Absent', variant: 'outline' as const },
    };
    return variants[currentStatus];
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Tableau de bord" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-1">
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>

        {/* Status Card */}
        <Card className="animate-slide-up border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Statut actuel</span>
              <Badge variant={getStatusBadge().variant}>
                {getStatusBadge().label}
              </Badge>
            </div>

            {nextShift && (
              <div className="space-y-2">
                <h3 className="font-semibold">{nextShift.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {nextShift.startTime} - {nextShift.endTime}
                  </span>
                  <span>{nextShift.location}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate('/check-in')}
                >
                  Pointer maintenant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Heures travaillées"
            value={`${performance.totalHours}h`}
            icon={Clock}
            trend="Ce mois"
          />
          <StatCard
            title="Missions"
            value={performance.shiftsCompleted}
            icon={Calendar}
            trend="Complétées"
          />
          <StatCard
            title="Ponctualité"
            value={`${performance.punctualityScore}%`}
            icon={TrendingUp}
            trend="Score"
          />
          <StatCard
            title="Performance"
            value={`${performance.performanceScore}%`}
            icon={Award}
            trend="Global"
          />
        </div>

        {/* Quick Actions */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/missions')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Missions</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/reports')}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">Rapports</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/incidents')}
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="text-xs">Incidents</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/guidelines')}
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">Règlement</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/support')}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Support</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Paramètres</span>
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
