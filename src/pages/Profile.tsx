import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Phone, MapPin, Mail, IdCard, Settings, FileText, Edit, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState, useRef } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    avatar: user?.avatar || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditForm({ ...editForm, avatar: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    toast.success('Profil mis à jour avec succès');
    setEditDialogOpen(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profil" showNotifications={false} />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* User Info Card */}
        <Card className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-muted-foreground mb-2">{user.role}</p>
            <p className="text-sm text-muted-foreground">
              Matricule: {user.matricule}
            </p>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {user.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3 animate-slide-up">
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={() => setEditDialogOpen(true)}
          >
            <Edit className="mr-3 h-5 w-5" />
            <div className="text-left flex-1">
              <p className="font-medium">Modifier le profil</p>
              <p className="text-xs text-muted-foreground">
                Email, mot de passe, photo
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-3 h-5 w-5" />
            <div className="text-left flex-1">
              <p className="font-medium">Paramètres</p>
              <p className="text-xs text-muted-foreground">
                Gérer vos préférences
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={() => navigate('/documents')}
          >
            <FileText className="mr-3 h-5 w-5" />
            <div className="text-left flex-1">
              <p className="font-medium">Documents</p>
              <p className="text-xs text-muted-foreground">
                Contrats, fiches et soumissions
              </p>
            </div>
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start h-auto py-4"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <div className="text-left flex-1">
              <p className="font-medium">Déconnexion</p>
              <p className="text-xs opacity-90">
                Se déconnecter de l'application
              </p>
            </div>
          </Button>
        </div>
      </main>

      <BottomNav />

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={editForm.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Laisser vide pour ne pas modifier"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
            </div>

            {/* Confirm Password */}
            {editForm.password && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateProfile}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
