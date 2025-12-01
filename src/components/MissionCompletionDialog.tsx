import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (photos: string[]) => void;
  missionTitle: string;
}

export function MissionCompletionDialog({
  open,
  onOpenChange,
  onComplete,
  missionTitle,
}: MissionCompletionDialogProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onComplete(photos);
    setPhotos([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compléter la mission</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {missionTitle}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-3">
              Ajouter des photos de preuve (optionnel)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              variant="outline"
              className="w-full h-24 border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Cliquez pour ajouter des photos
                </span>
              </div>
            </Button>
          </div>

          {photos.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">
                Photos ajoutées ({photos.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-md overflow-hidden border border-border"
                  >
                    <img
                      src={photo}
                      alt={`Preuve ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleComplete}>
            <Camera className="h-4 w-4 mr-2" />
            Marquer comme terminée
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
