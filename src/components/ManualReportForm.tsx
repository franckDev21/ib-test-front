import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileText, Plus, Trash2, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Task {
  id: string;
  description: string;
  status: 'completed' | 'in_progress' | 'blocked';
  duration: string;
}

interface ManualReport {
  date: string;
  arrivalTime: string;
  departureTime: string;
  pauseDuration: string;
  tasks: Task[];
  notes: string;
  difficulties: string;
}

export const ManualReportForm = () => {
  const [report, setReport] = useState<ManualReport>({
    date: format(new Date(), 'yyyy-MM-dd'),
    arrivalTime: '08:00',
    departureTime: '17:00',
    pauseDuration: '60',
    tasks: [{ id: '1', description: '', status: 'completed', duration: '' }],
    notes: '',
    difficulties: '',
  });

  const addTask = () => {
    setReport({
      ...report,
      tasks: [...report.tasks, { id: Date.now().toString(), description: '', status: 'completed', duration: '' }],
    });
  };

  const removeTask = (id: string) => {
    if (report.tasks.length > 1) {
      setReport({
        ...report,
        tasks: report.tasks.filter(t => t.id !== id),
      });
    }
  };

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setReport({
      ...report,
      tasks: report.tasks.map(t => t.id === id ? { ...t, [field]: value } : t),
    });
  };

  const handleSubmit = () => {
    const incompleteTasks = report.tasks.filter(t => !t.description);
    if (incompleteTasks.length > 0) {
      toast.error('Veuillez remplir toutes les tâches');
      return;
    }
    toast.success('Rapport soumis avec succès');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Saisie manuelle du rapport
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date & Horaires */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={report.date}
              onChange={(e) => setReport({ ...report, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pauseDuration">Pause (min)</Label>
            <Input
              id="pauseDuration"
              type="number"
              placeholder="60"
              value={report.pauseDuration}
              onChange={(e) => setReport({ ...report, pauseDuration: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">Arrivée</Label>
            <Input
              id="arrivalTime"
              type="time"
              value={report.arrivalTime}
              onChange={(e) => setReport({ ...report, arrivalTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departureTime">Départ</Label>
            <Input
              id="departureTime"
              type="time"
              value={report.departureTime}
              onChange={(e) => setReport({ ...report, departureTime: e.target.value })}
            />
          </div>
        </div>

        {/* Tâches */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Tâches réalisées</Label>
            <Button variant="ghost" size="sm" onClick={addTask}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>

          <div className="space-y-3">
            {report.tasks.map((task, index) => (
              <div 
                key={task.id} 
                className="p-4 rounded-lg border border-border bg-muted/30 space-y-3 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Description de la tâche..."
                      value={task.description}
                      onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                      className="min-h-[60px] resize-none"
                    />
                    <div className="flex gap-3">
                      <Select
                        value={task.status}
                        onValueChange={(value) => updateTask(task.id, 'status', value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Terminée
                            </div>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-500" />
                              En cours
                            </div>
                          </SelectItem>
                          <SelectItem value="blocked">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              Bloquée
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Durée (ex: 2h)"
                        value={task.duration}
                        onChange={(e) => updateTask(task.id, 'duration', e.target.value)}
                        className="w-[100px]"
                      />
                    </div>
                  </div>
                  {report.tasks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes & Difficultés */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes supplémentaires</Label>
          <Textarea
            id="notes"
            placeholder="Remarques, observations..."
            value={report.notes}
            onChange={(e) => setReport({ ...report, notes: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulties">Difficultés rencontrées</Label>
          <Textarea
            id="difficulties"
            placeholder="Obstacles, problèmes..."
            value={report.difficulties}
            onChange={(e) => setReport({ ...report, difficulties: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        {/* Submit */}
        <Button onClick={handleSubmit} className="w-full" size="lg">
          <Send className="h-5 w-5 mr-2" />
          Soumettre le rapport
        </Button>
      </CardContent>
    </Card>
  );
};
