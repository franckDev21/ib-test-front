import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, TrendingUp, Award, FileText, Eye, PenLine } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ReportPreviewDialog } from '@/components/ReportPreviewDialog';
import { ManualReportForm } from '@/components/ManualReportForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reports = () => {
  const { performance, shifts, checkIns } = useDataStore();
  const [showPreview, setShowPreview] = useState(false);

  const completedShifts = shifts.filter(shift => shift.status === 'completed');

  const openReportPreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header title="Rapports & Performance" showReport={false} />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        <Tabs defaultValue="auto" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auto" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Automatique
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Manuel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-6 mt-4">
            {/* Generate Report Button */}
            <Button 
              onClick={openReportPreview}
              className="w-full"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Générer un rapport journalier
              <Eye className="h-4 w-4 ml-2" />
            </Button>

            <ReportPreviewDialog
              open={showPreview}
              onOpenChange={setShowPreview}
              checkIns={checkIns}
              completedShifts={completedShifts}
              performance={performance}
            />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total heures"
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

        {/* Weekly Hours Chart */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Heures hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performance.weeklyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="hours"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Details */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Détails de performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Ponctualité</span>
                <span className="text-sm font-semibold">
                  {performance.punctualityScore}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${performance.punctualityScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Performance globale
                </span>
                <span className="text-sm font-semibold">
                  {performance.performanceScore}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${performance.performanceScore}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Missions complétées</span>
                <span className="font-semibold">
                  {performance.shiftsCompleted}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Heures travaillées</span>
                <span className="font-semibold">{performance.totalHours}h</span>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Completed Missions */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-base">Missions complétées</CardTitle>
              </CardHeader>
              <CardContent>
                {completedShifts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune mission complétée pour le moment
                  </p>
                ) : (
                  <div className="space-y-3">
                    {completedShifts.map((shift) => (
                      <div 
                        key={shift.id}
                        className="p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <h4 className="font-semibold text-sm mb-1">{shift.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(shift.date), 'd MMM yyyy', { locale: fr })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="mt-4">
            <ManualReportForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
