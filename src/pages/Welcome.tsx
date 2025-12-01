import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Clock, BarChart3, Users } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  // Fake company data - will be replaced with API data
  const companyData = {
    name: 'TechCorp Industries',
    logo: null, // Will be company logo URL
    welcomeMessage: 'Bienvenue dans votre espace employé',
    description: 'Gérez vos pointages, missions et rapports en toute simplicité.',
  };

  const features = [
    {
      icon: Clock,
      title: 'Pointage simplifié',
      description: 'Arrivée, pause et départ en un clic',
    },
    {
      icon: BarChart3,
      title: 'Suivi de performance',
      description: 'Visualisez vos statistiques en temps réel',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Restez connecté avec votre équipe',
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground text-lg font-bold">IB</span>
          </div>
          <span className="text-xl font-bold">IchBin</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-8">
          {/* Company Logo & Welcome */}
          <div className="text-center space-y-4 animate-fade-in">
            {companyData.logo ? (
              <img 
                src={companyData.logo} 
                alt={companyData.name}
                className="w-24 h-24 mx-auto rounded-2xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center border border-border">
                <span className="text-3xl font-bold text-primary">TC</span>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Invité par</p>
              <h1 className="text-2xl font-bold">{companyData.name}</h1>
            </div>
          </div>

          {/* Welcome Message */}
          <Card className="animate-slide-up border-primary/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">{companyData.welcomeMessage}</h2>
              <p className="text-muted-foreground">{companyData.description}</p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <feature.icon className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="w-full h-14 text-base animate-slide-up"
            style={{ animationDelay: '200ms' }}
            onClick={() => navigate('/login')}
          >
            Accéder à mon espace
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Footer Info */}
          <p className="text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
            Votre compte a été créé par votre manager.
            <br />
            Utilisez vos identifiants pour vous connecter.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 IchBin - Tous droits réservés
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
