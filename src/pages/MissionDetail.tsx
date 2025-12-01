import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MentionInput } from '@/components/MentionInput';
import { useDataStore } from '@/store/dataStore';
import { Calendar, Clock, MapPin, User, ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { toast } from 'sonner';

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shifts = useDataStore((state) => state.shifts);
  const employees = useDataStore((state) => state.employees);
  const addShiftComment = useDataStore((state) => state.addShiftComment);
  
  const shift = shifts.find((s) => s.id === id);
  const [newComment, setNewComment] = useState('');


  if (!shift) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Mission introuvable</h1>
          </div>
        </div>
        <main className="max-w-lg mx-auto p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Cette mission n'existe pas.</p>
              <Button onClick={() => navigate('/missions')} className="mt-4">
                Retour aux missions
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ongoing: { label: 'En cours', variant: 'default' as const },
      upcoming: { label: 'À venir', variant: 'secondary' as const },
      completed: { label: 'Terminée', variant: 'outline' as const },
    };
    return variants[status as keyof typeof variants];
  };

  const handleAddComment = () => {
    if (id && newComment.trim()) {
      addShiftComment(id, newComment);
      setNewComment('');
      toast.success('Commentaire ajouté');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/missions')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Détails de la mission</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Mission Info */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>{shift.title}</CardTitle>
              <Badge variant={getStatusBadge(shift.status).variant}>
                {getStatusBadge(shift.status).label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(shift.date), "EEEE d MMMM yyyy", { locale: fr })}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{shift.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{shift.supervisor}</span>
            </div>

            {shift.instructions && (
              <div className="pt-3 border-t border-border">
                <h4 className="text-sm font-semibold mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground">{shift.instructions}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completion Photos */}
        {shift.completionPhotos && shift.completionPhotos.length > 0 && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base">Photos de preuve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {shift.completionPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Preuve ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-md border border-border"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Commentaires</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {shift.comments?.length || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Liste des commentaires existants */}
            {shift.comments && shift.comments.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {shift.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {comment.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(comment.date), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed break-words">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Aucun commentaire pour le moment
              </div>
            )}

            {/* Formulaire d'ajout de commentaire */}
            <div className="space-y-3 pt-3 border-t border-border">
              <MentionInput
                value={newComment}
                onChange={setNewComment}
                employees={employees}
                placeholder="Ajoutez un commentaire... Utilisez @ pour mentionner"
              />
              <Button 
                onClick={handleAddComment} 
                className="w-full"
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer le commentaire
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default MissionDetail;
