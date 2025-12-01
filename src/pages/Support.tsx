import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDataStore, Incident } from '@/store/dataStore';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/shared/EmptyState';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Support = () => {
  const { incidents, addIncident } = useDataStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Incident['category']>('equipment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    addIncident({ title, description, category });
    toast.success('Incident signalé avec succès');
    setTitle('');
    setDescription('');
    setCategory('equipment');
  };

  const getStatusBadge = (status: Incident['status']) => {
    const variants = {
      pending: {
        label: 'En attente',
        variant: 'secondary' as const,
        icon: Clock,
      },
      in_progress: {
        label: 'En cours',
        variant: 'default' as const,
        icon: AlertCircle,
      },
      resolved: {
        label: 'Résolu',
        variant: 'outline' as const,
        icon: CheckCircle,
      },
    };
    return variants[status];
  };

  const categoryLabels = {
    equipment: 'Matériel',
    security: 'Sécurité',
    human: 'Ressources humaines',
    administrative: 'Administratif',
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header title="Support & Incidents" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* Report Form */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Signaler un incident</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Résumé de l'incident"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as Incident['category'])}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Matériel</SelectItem>
                    <SelectItem value="security">Sécurité</SelectItem>
                    <SelectItem value="human">Ressources humaines</SelectItem>
                    <SelectItem value="administrative">Administratif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez l'incident en détail..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Envoyer le rapport
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Incidents History */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Historique des incidents
          </h3>

          {incidents.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={AlertCircle}
                  title="Aucun incident signalé"
                  description="Vous n'avez signalé aucun incident"
                />
              </CardContent>
            </Card>
          ) : (
            incidents.map((incident, index) => {
              const statusBadge = getStatusBadge(incident.status);
              const StatusIcon = statusBadge.icon;

              return (
                <Card
                  key={incident.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{incident.title}</h3>
                          <Badge variant={statusBadge.variant} className="text-xs flex-shrink-0">
                            {statusBadge.label}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2">
                          {categoryLabels[incident.category]}
                        </p>

                        <p className="text-sm text-muted-foreground mb-2">
                          {incident.description}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {format(new Date(incident.date), "d MMMM yyyy 'à' HH:mm", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Support;
