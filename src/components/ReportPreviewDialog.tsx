import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Send, FileText, Clock, Calendar, Award, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface CheckInData {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  pauseStart?: string;
  pauseEnd?: string;
  pauseDuration?: string;
  duration?: string;
  status: string;
}

interface ShiftData {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
}

interface PerformanceData {
  totalHours: number;
  shiftsCompleted: number;
  punctualityScore: number;
  performanceScore: number;
}

interface ReportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkIns: CheckInData[];
  completedShifts: ShiftData[];
  performance: PerformanceData;
}

export const ReportPreviewDialog = ({
  open,
  onOpenChange,
  checkIns,
  completedShifts,
  performance,
}: ReportPreviewDialogProps) => {
  const todayCheckIns = checkIns.filter(
    (c) => c.date === format(new Date(), 'yyyy-MM-dd')
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("RAPPORT D'ACTIVITÉ JOURNALIER", pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // Employee Info
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLOYÉ', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Nom: Employé IchBin', 20, yPosition);
    yPosition += 6;
    doc.text('Matricule: EMP001', 20, yPosition);

    // Today's Check-ins
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('POINTAGE DU JOUR', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (todayCheckIns.length === 0) {
      doc.text("Aucun pointage pour aujourd'hui", 20, yPosition);
      yPosition += 6;
    } else {
      todayCheckIns.forEach((checkIn, index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`Pointage ${index + 1}:`, 20, yPosition);
        yPosition += 6;
        doc.setFont('helvetica', 'normal');
        doc.text(`  Arrivée: ${checkIn.checkIn}`, 20, yPosition);
        yPosition += 5;
        doc.text(`  Départ: ${checkIn.checkOut || 'En cours'}`, 20, yPosition);
        yPosition += 5;
        if (checkIn.pauseStart && checkIn.pauseEnd) {
          doc.text(`  Pause: ${checkIn.pauseDuration} (de ${checkIn.pauseStart} à ${checkIn.pauseEnd})`, 20, yPosition);
          yPosition += 5;
        }
        doc.text(`  Durée totale: ${checkIn.duration || 'En cours'}`, 20, yPosition);
        yPosition += 8;
      });
    }

    // Completed Missions
    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MISSIONS COMPLÉTÉES', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${completedShifts.length} mission(s) terminée(s)`, 20, yPosition);
    yPosition += 8;

    completedShifts.forEach((shift, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${shift.title}`, 20, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`   Date: ${format(new Date(shift.date), 'dd/MM/yyyy', { locale: fr })}`, 20, yPosition);
      yPosition += 5;
      doc.text(`   Lieu: ${shift.location}`, 20, yPosition);
      yPosition += 5;
      doc.text(`   Horaires: ${shift.startTime} - ${shift.endTime}`, 20, yPosition);
      yPosition += 8;
    });

    // Performance
    yPosition += 5;
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PERFORMANCE', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total heures: ${performance.totalHours}h`, 20, yPosition);
    yPosition += 6;
    doc.text(`Missions complétées: ${performance.shiftsCompleted}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Score de ponctualité: ${performance.punctualityScore}%`, 20, yPosition);
    yPosition += 6;
    doc.text(`Score de performance: ${performance.performanceScore}%`, 20, yPosition);

    // Footer
    yPosition += 15;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Rapport généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );

    return doc;
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(`rapport_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('Rapport téléchargé avec succès');
    onOpenChange(false);
  };

  const handleSendToManager = () => {
    // Mock send to manager - will be replaced with API
    toast.success('Rapport envoyé au manager avec succès');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Prévisualisation du rapport
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-6 py-4">
            {/* Report Header */}
            <div className="text-center p-4 bg-muted/50 rounded-xl border border-border">
              <h3 className="font-bold text-lg">RAPPORT D'ACTIVITÉ JOURNALIER</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>

            {/* Employee Info */}
            <div className="p-4 bg-card rounded-xl border border-border">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">EMPLOYÉ</h4>
              <p className="font-medium">Employé IchBin</p>
              <p className="text-sm text-muted-foreground">Matricule: EMP001</p>
            </div>

            {/* Today's Check-ins */}
            <div className="p-4 bg-card rounded-xl border border-border">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                POINTAGE DU JOUR
              </h4>
              {todayCheckIns.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun pointage pour aujourd'hui</p>
              ) : (
                <div className="space-y-3">
                  {todayCheckIns.map((checkIn, index) => (
                    <div key={checkIn.id} className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-medium text-sm mb-2">Pointage {index + 1}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Arrivée:</span>{' '}
                          <span className="font-medium">{checkIn.checkIn}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Départ:</span>{' '}
                          <span className="font-medium">{checkIn.checkOut || 'En cours'}</span>
                        </div>
                        {checkIn.pauseStart && checkIn.pauseEnd && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Pause:</span>{' '}
                            <span className="font-medium">
                              {checkIn.pauseDuration} (de {checkIn.pauseStart} à {checkIn.pauseEnd})
                            </span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Durée totale:</span>{' '}
                          <span className="font-medium text-primary">{checkIn.duration || 'En cours'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Missions */}
            <div className="p-4 bg-card rounded-xl border border-border">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                MISSIONS COMPLÉTÉES ({completedShifts.length})
              </h4>
              {completedShifts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune mission complétée</p>
              ) : (
                <div className="space-y-2">
                  {completedShifts.slice(0, 5).map((shift) => (
                    <div key={shift.id} className="p-2 bg-muted/30 rounded-lg">
                      <p className="font-medium text-sm">{shift.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(shift.date), 'd MMM yyyy', { locale: fr })} • {shift.startTime} - {shift.endTime}
                      </p>
                    </div>
                  ))}
                  {completedShifts.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{completedShifts.length - 5} autres missions
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Performance */}
            <div className="p-4 bg-card rounded-xl border border-border">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                PERFORMANCE
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{performance.totalHours}h</p>
                  <p className="text-xs text-muted-foreground">Total heures</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{performance.shiftsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Missions</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{performance.punctualityScore}%</p>
                  <p className="text-xs text-muted-foreground">Ponctualité</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{performance.performanceScore}%</p>
                  <p className="text-xs text-muted-foreground">Performance</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <Button className="w-full" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger le PDF
          </Button>
          <Button variant="outline" className="w-full" onClick={handleSendToManager}>
            <Send className="h-4 w-4 mr-2" />
            Envoyer mon rapport au manager
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
