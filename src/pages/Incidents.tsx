import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Camera, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: Date;
  photos?: string[];
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Équipement défectueux',
    description: 'La machine à café de la salle de pause ne fonctionne plus.',
    type: 'equipment',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    title: 'Problème d\'accès',
    description: 'Badge d\'accès ne fonctionne pas pour le parking niveau -2.',
    type: 'access',
    status: 'resolved',
    createdAt: new Date(Date.now() - 172800000),
  },
];

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotos(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = () => {
    if (!title || !description || !type) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newIncident: Incident = {
      id: Date.now().toString(),
      title,
      description,
      type,
      status: 'pending',
      createdAt: new Date(),
      photos,
    };

    setIncidents([newIncident, ...incidents]);
    setTitle('');
    setDescription('');
    setType('');
    setPhotos([]);
    setShowForm(false);
    toast.success('Incident signalé avec succès');
  };

  const getStatusInfo = (status: Incident['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', variant: 'secondary' as const, icon: Clock };
      case 'in_progress':
        return { label: 'En cours', variant: 'default' as const, icon: AlertTriangle };
      case 'resolved':
        return { label: 'Résolu', variant: 'outline' as const, icon: CheckCircle2 };
      case 'rejected':
        return { label: 'Rejeté', variant: 'destructive' as const, icon: XCircle };
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      equipment: 'Équipement',
      safety: 'Sécurité',
      access: 'Accès',
      other: 'Autre',
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Incidents" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* Report Button */}
        {!showForm && (
          <Button 
            className="w-full h-14" 
            onClick={() => setShowForm(true)}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Signaler un incident
          </Button>
        )}

        {/* Report Form */}
        {showForm && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">Nouveau signalement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Type d'incident *</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Équipement</SelectItem>
                    <SelectItem value="safety">Sécurité</SelectItem>
                    <SelectItem value="access">Accès</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Titre *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Résumé de l'incident"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Description *</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'incident en détail..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Photos (optionnel)</label>
                <div className="flex gap-2 flex-wrap">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                        className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl p-1"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    setTitle('');
                    setDescription('');
                    setType('');
                    setPhotos([]);
                  }}
                >
                  Annuler
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Incidents List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Mes signalements ({incidents.length})
          </h3>

          {incidents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Aucun incident signalé
              </CardContent>
            </Card>
          ) : (
            incidents.map((incident) => {
              const statusInfo = getStatusInfo(incident.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={incident.id} className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(incident.type)}
                          </Badge>
                          <Badge variant={statusInfo.variant} className="text-xs">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <h4 className="font-medium truncate">{incident.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {incident.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(incident.createdAt, 'd MMMM yyyy à HH:mm', { locale: fr })}
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

      <BottomNav />
    </div>
  );
};

export default Incidents;
