import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/dataStore';
import { Calendar, Clock, MapPin, ChevronRight, CheckCircle, MessageSquare, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { MissionCompletionDialog } from '@/components/MissionCompletionDialog';
import { useNavigate } from 'react-router-dom';
import { AssignedEmployees } from '@/components/AssignedEmployees';

const Missions = () => {
  const shifts = useDataStore((state) => state.shifts);
  const updateShiftStatus = useDataStore((state) => state.updateShiftStatus);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [completingShiftId, setCompletingShiftId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const variants = {
      ongoing: { label: 'En cours', variant: 'default' as const },
      upcoming: { label: 'À venir', variant: 'secondary' as const },
      completed: { label: 'Terminée', variant: 'outline' as const },
    };
    return variants[status as keyof typeof variants];
  };

  const handleStatusUpdate = (shiftId: string, newStatus: 'upcoming' | 'ongoing' | 'completed') => {
    if (newStatus === 'completed') {
      setCompletingShiftId(shiftId);
      setCompletionDialogOpen(true);
    } else {
      updateShiftStatus(shiftId, newStatus);
      toast({
        title: "Statut mis à jour",
        description: `La mission a été marquée comme ${getStatusBadge(newStatus).label.toLowerCase()}.`,
      });
    }
  };

  const handleCompleteWithPhotos = (photos: string[]) => {
    if (completingShiftId) {
      updateShiftStatus(completingShiftId, 'completed', photos);
      toast({
        title: "Mission terminée",
        description: `La mission a été marquée comme terminée${photos.length > 0 ? ` avec ${photos.length} photo(s)` : ''}.`,
      });
      setCompletingShiftId(null);
    }
  };

  const getCardBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/5 border-green-500/20';
      case 'ongoing':
        return 'bg-blue-500/5 border-blue-500/20';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Missions & Shifts" />

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {shifts.map((shift, index) => (
          <Card
            key={shift.id}
            className={cn(
              'overflow-hidden cursor-pointer transition-all animate-slide-up',
              selectedShift === shift.id && 'ring-2 ring-primary',
              getCardBgColor(shift.status)
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedShift(selectedShift === shift.id ? null : shift.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{shift.title}</h3>
                  <Badge variant={getStatusBadge(shift.status).variant} className="text-xs">
                    {getStatusBadge(shift.status).label}
                  </Badge>
                </div>
                <ChevronRight
                  className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform',
                    selectedShift === shift.id && 'rotate-90'
                  )}
                />
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(shift.date), "EEEE d MMMM yyyy", { locale: fr })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {shift.startTime} - {shift.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{shift.location}</span>
                </div>
              </div>

              {/* Assigned Employees */}
              {shift.assignedEmployees && shift.assignedEmployees.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Assignés</span>
                  </div>
                  <AssignedEmployees 
                    employees={shift.assignedEmployees} 
                    size="sm"
                    maxDisplay={4}
                  />
                </div>
              )}

              {selectedShift === shift.id && (
                <div className="mt-4 pt-4 border-t border-border animate-fade-in space-y-4">
                  {shift.instructions && (
                    <>
                      <h4 className="text-sm font-semibold mb-2">Instructions</h4>
                      <p className="text-sm text-muted-foreground">{shift.instructions}</p>
                    </>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Mettre à jour le statut</h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={shift.status === 'ongoing' ? 'default' : 'outline'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(shift.id, 'ongoing');
                          }}
                          className="flex-1"
                        >
                          En cours
                        </Button>
                        <Button
                          size="sm"
                          variant={shift.status === 'completed' ? 'default' : 'outline'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(shift.id, 'completed');
                          }}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terminée
                        </Button>
                      </div>
                    </div>

                    {shift.completionPhotos && shift.completionPhotos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Photos de preuve</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {shift.completionPhotos.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`Preuve ${idx + 1}`}
                              className="w-full aspect-square object-cover rounded-md border border-border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mission/${shift.id}`);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Voir les détails et commentaires
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav />
      
      <MissionCompletionDialog
        open={completionDialogOpen}
        onOpenChange={setCompletionDialogOpen}
        onComplete={handleCompleteWithPhotos}
        missionTitle={shifts.find(s => s.id === completingShiftId)?.title || ''}
      />
    </div>
  );
};

export default Missions;
