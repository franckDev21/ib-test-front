import { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Upload, 
  Calendar, 
  Eye, 
  Send,
  File,
  FileCheck,
  FileClock,
  FileX,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'payslip' | 'certificate' | 'other';
  date: string;
  size: string;
  status?: 'pending' | 'approved' | 'rejected';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contrat de travail CDI',
    type: 'contract',
    date: '2024-01-15',
    size: '245 Ko',
  },
  {
    id: '2',
    name: 'Fiche de paie - Novembre 2024',
    type: 'payslip',
    date: '2024-11-30',
    size: '128 Ko',
  },
  {
    id: '3',
    name: 'Fiche de paie - Octobre 2024',
    type: 'payslip',
    date: '2024-10-31',
    size: '125 Ko',
  },
  {
    id: '4',
    name: 'Attestation de formation sécurité',
    type: 'certificate',
    date: '2024-06-20',
    size: '89 Ko',
  },
  {
    id: '5',
    name: 'Règlement intérieur',
    type: 'other',
    date: '2024-01-01',
    size: '512 Ko',
  },
];

const mockSubmittedDocs: Document[] = [
  {
    id: '101',
    name: 'Justificatif de domicile',
    type: 'other',
    date: '2024-11-15',
    size: '1.2 Mo',
    status: 'approved',
  },
  {
    id: '102',
    name: 'Certificat médical',
    type: 'certificate',
    date: '2024-11-28',
    size: '340 Ko',
    status: 'pending',
  },
];

const Documents = () => {
  const [documents] = useState<Document[]>(mockDocuments);
  const [submittedDocs, setSubmittedDocs] = useState<Document[]>(mockSubmittedDocs);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'other' as Document['type'],
    description: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      contract: 'Contrat',
      payslip: 'Fiche de paie',
      certificate: 'Attestation',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Approuvé</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <FileClock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <FileX className="h-5 w-5 text-red-500" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm({ ...uploadForm, name: file.name.replace(/\.[^/.]+$/, '') });
    }
  };

  const handleSubmitDocument = () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    if (!uploadForm.name) {
      toast.error('Veuillez donner un nom au document');
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: uploadForm.name,
      type: uploadForm.type,
      date: format(new Date(), 'yyyy-MM-dd'),
      size: `${(selectedFile.size / 1024).toFixed(0)} Ko`,
      status: 'pending',
    };

    setSubmittedDocs([newDoc, ...submittedDocs]);
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setUploadForm({ name: '', type: 'other', description: '' });
    toast.success('Document soumis avec succès');
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Téléchargement de "${doc.name}"...`);
  };

  const handleView = (doc: Document) => {
    toast.info(`Aperçu de "${doc.name}"...`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Documents" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Mes documents</TabsTrigger>
            <TabsTrigger value="submitted">Soumissions</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 mt-4">
            {/* Documents disponibles */}
            {documents.map((doc, index) => (
              <Card 
                key={doc.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(doc.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {doc.size}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(doc.date), 'd MMM yyyy', { locale: fr })}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(doc)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="submitted" className="space-y-4 mt-4">
            {/* Bouton Soumettre */}
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="w-full"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Soumettre un document
            </Button>

            {/* Documents soumis */}
            {submittedDocs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Aucun document soumis</p>
                </CardContent>
              </Card>
            ) : (
              submittedDocs.map((doc, index) => (
                <Card 
                  key={doc.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                          {getStatusBadge(doc.status)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(doc.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {doc.size}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Soumis le {format(new Date(doc.date), 'd MMM yyyy', { locale: fr })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Soumettre un document
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Input */}
            <div 
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <FileCheck className="h-10 w-10 mx-auto text-primary" />
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(0)} Ko
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>
              )}
            </div>

            {/* Document Name */}
            <div className="space-y-2">
              <Label htmlFor="docName">Nom du document</Label>
              <Input
                id="docName"
                placeholder="Ex: Certificat médical"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
              />
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label>Type de document</Label>
              <Select
                value={uploadForm.type}
                onValueChange={(value: Document['type']) => setUploadForm({ ...uploadForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificate">Attestation / Certificat</SelectItem>
                  <SelectItem value="contract">Contrat</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="docDescription">Description (optionnel)</Label>
              <Textarea
                id="docDescription"
                placeholder="Informations supplémentaires..."
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitDocument}>
              <Send className="h-4 w-4 mr-2" />
              Soumettre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
