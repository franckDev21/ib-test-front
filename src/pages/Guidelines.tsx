import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Search, FileText, Shield, Clock, Users, AlertTriangle } from 'lucide-react';

interface Guideline {
  id: string;
  category: string;
  title: string;
  content: string;
  icon: typeof FileText;
  important?: boolean;
}

const mockGuidelines: Guideline[] = [
  {
    id: '1',
    category: 'Sécurité',
    title: 'Port des équipements de protection',
    content: 'Tout employé doit porter les équipements de protection individuelle (EPI) adaptés à son poste. Cela inclut : casque de sécurité dans les zones de chantier, gilet haute visibilité, chaussures de sécurité. Le non-respect de cette règle peut entraîner des sanctions disciplinaires.',
    icon: Shield,
    important: true,
  },
  {
    id: '2',
    category: 'Horaires',
    title: 'Pointage obligatoire',
    content: 'Chaque employé doit pointer son arrivée et son départ via l\'application IchBin. Le pointage doit être effectué dans les 5 minutes suivant l\'arrivée ou précédant le départ. En cas d\'oubli, contactez immédiatement votre responsable.',
    icon: Clock,
  },
  {
    id: '3',
    category: 'Horaires',
    title: 'Gestion des pauses',
    content: 'Une pause déjeuner d\'une heure minimum est obligatoire pour toute journée de plus de 6 heures. Les pauses doivent être pointées dans l\'application. Le total des pauses ne doit pas excéder 1h30 par jour sauf autorisation spéciale.',
    icon: Clock,
  },
  {
    id: '4',
    category: 'Conduite',
    title: 'Relations professionnelles',
    content: 'Le respect mutuel entre collègues est fondamental. Tout comportement irrespectueux, discriminatoire ou harcelant sera sanctionné. En cas de conflit, adressez-vous à votre responsable ou aux ressources humaines.',
    icon: Users,
  },
  {
    id: '5',
    category: 'Sécurité',
    title: 'Procédure d\'évacuation',
    content: 'En cas d\'alarme incendie : 1) Arrêtez immédiatement votre travail, 2) Ne prenez pas l\'ascenseur, 3) Rejoignez le point de rassemblement (parking A), 4) Attendez les instructions du responsable sécurité. Ne retournez pas chercher vos affaires.',
    icon: AlertTriangle,
    important: true,
  },
  {
    id: '6',
    category: 'Administratif',
    title: 'Demandes de congés',
    content: 'Toute demande de congé doit être soumise au moins 2 semaines à l\'avance via le système RH. Les congés sont accordés selon les besoins du service et le planning. Pour les urgences, contactez directement votre responsable.',
    icon: FileText,
  },
];

const Guidelines = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [...new Set(mockGuidelines.map(g => g.category))];
  
  const filteredGuidelines = mockGuidelines.filter(
    g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         g.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
         g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGuidelinesByCategory = (category: string) => 
    filteredGuidelines.filter(g => g.category === category);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Règlement" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* Search */}
        <div className="relative animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans le règlement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Important Notice */}
        <Card className="border-primary/30 bg-primary/5 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Règlement interne</h3>
                <p className="text-xs text-muted-foreground">
                  Ce règlement est applicable à tous les employés. Sa lecture et son respect sont obligatoires.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines by Category */}
        {categories.map(category => {
          const categoryGuidelines = getGuidelinesByCategory(category);
          if (categoryGuidelines.length === 0) return null;
          
          return (
            <div key={category} className="space-y-3 animate-fade-in">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                {category}
                <Badge variant="secondary" className="text-xs">
                  {categoryGuidelines.length}
                </Badge>
              </h3>
              
              <Accordion type="single" collapsible className="space-y-2">
                {categoryGuidelines.map(guideline => {
                  const Icon = guideline.icon;
                  return (
                    <AccordionItem 
                      key={guideline.id} 
                      value={guideline.id}
                      className="border rounded-xl overflow-hidden bg-card"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            guideline.important ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{guideline.title}</h4>
                            {guideline.important && (
                              <Badge variant="outline" className="text-xs mt-1 border-primary/30 text-primary">
                                Important
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                          {guideline.content}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          );
        })}

        {filteredGuidelines.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Aucun résultat trouvé pour "{searchQuery}"
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Guidelines;
