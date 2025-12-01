import { create } from 'zustand';
import { addDays, subDays, format } from 'date-fns';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  date: string;
  text: string;
}

export interface AssignedEmployee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Shift {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  supervisor: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  instructions?: string;
  comments?: Comment[];
  completionPhotos?: string[];
  assignedEmployees?: AssignedEmployee[];
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface CheckInOut {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  pauseStart?: string;
  pauseEnd?: string;
  pauseDuration?: string;
  status: 'present' | 'pause' | 'completed';
  duration?: string;
  checkInLocation?: GeoLocation;
  checkOutLocation?: GeoLocation;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'urgent' | 'instruction' | 'reminder' | 'info';
  date: string;
  read: boolean;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: 'equipment' | 'security' | 'human' | 'administrative';
  status: 'pending' | 'in_progress' | 'resolved';
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
}

export interface Performance {
  totalHours: number;
  shiftsCompleted: number;
  punctualityScore: number;
  performanceScore: number;
  weeklyHours: Array<{ day: string; hours: number }>;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Marie Laurent', role: 'Superviseur' },
  { id: '2', name: 'Pierre Martin', role: 'Technicien' },
  { id: '3', name: 'Sophie Dubois', role: 'Formatrice' },
  { id: '4', name: 'Jean Dupont', role: 'Agent de sécurité' },
  { id: '5', name: 'Emma Bernard', role: 'Responsable RH' },
  { id: '6', name: 'Lucas Petit', role: 'Technicien' },
  { id: '7', name: 'Chloé Moreau', role: 'Assistante' },
];

interface DataState {
  shifts: Shift[];
  checkIns: CheckInOut[];
  notifications: Notification[];
  incidents: Incident[];
  performance: Performance;
  employees: Employee[];
  currentStatus: 'absent' | 'present' | 'pause';
  
  // Actions
  checkIn: (location?: GeoLocation) => void;
  checkOut: (location?: GeoLocation) => void;
  togglePause: () => void;
  markNotificationRead: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'date' | 'status'>) => void;
  updateShiftStatus: (id: string, status: 'upcoming' | 'ongoing' | 'completed', photos?: string[]) => void;
  addShiftComment: (id: string, text: string) => void;
}

const mockShifts: Shift[] = [
  {
    id: '1',
    title: 'Service Matin',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '08:00',
    endTime: '16:00',
    location: 'Site Principal - Batiment A',
    supervisor: 'Marie Laurent',
    status: 'ongoing',
    instructions: 'Préparation de la salle de conférence pour la réunion de 10h.',
    assignedEmployees: [
      { id: '1', name: 'Marie Laurent', role: 'Superviseur', avatar: 'https://i.pravatar.cc/150?u=marie' },
      { id: '4', name: 'Jean Dupont', role: 'Agent de sécurité', avatar: 'https://i.pravatar.cc/150?u=jean' },
    ],
    comments: [
      {
        id: '1',
        author: 'Marie Laurent',
        date: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm'),
        text: 'N\'oubliez pas de vérifier le matériel audiovisuel avant la réunion.',
      },
      {
        id: '2',
        author: 'Admin User',
        date: format(new Date(), 'yyyy-MM-dd HH:mm'),
        text: 'Tout est prêt pour la réunion de demain.',
      },
    ],
  },
  {
    id: '2',
    title: 'Maintenance Équipement',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Site Principal - Zone Technique',
    supervisor: 'Pierre Martin',
    status: 'upcoming',
    assignedEmployees: [
      { id: '2', name: 'Pierre Martin', role: 'Technicien', avatar: 'https://i.pravatar.cc/150?u=pierre' },
      { id: '6', name: 'Lucas Petit', role: 'Technicien', avatar: 'https://i.pravatar.cc/150?u=lucas' },
      { id: '7', name: 'Chloé Moreau', role: 'Assistante', avatar: 'https://i.pravatar.cc/150?u=chloe' },
    ],
  },
  {
    id: '3',
    title: 'Formation Sécurité',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '18:00',
    location: 'Salle de Formation',
    supervisor: 'Sophie Dubois',
    status: 'upcoming',
    assignedEmployees: [
      { id: '3', name: 'Sophie Dubois', role: 'Formatrice', avatar: 'https://i.pravatar.cc/150?u=sophie' },
      { id: '4', name: 'Jean Dupont', role: 'Agent de sécurité', avatar: 'https://i.pravatar.cc/150?u=jean' },
      { id: '5', name: 'Emma Bernard', role: 'Responsable RH', avatar: 'https://i.pravatar.cc/150?u=emma' },
      { id: '6', name: 'Lucas Petit', role: 'Technicien', avatar: 'https://i.pravatar.cc/150?u=lucas' },
      { id: '7', name: 'Chloé Moreau', role: 'Assistante', avatar: 'https://i.pravatar.cc/150?u=chloe' },
    ],
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Réunion d\'équipe',
    message: 'Réunion d\'équipe prévue demain à 10h en salle de conférence.',
    category: 'reminder',
    date: format(new Date(), 'yyyy-MM-dd HH:mm'),
    read: false,
  },
  {
    id: '2',
    title: 'Mise à jour planning',
    message: 'Votre planning de la semaine prochaine a été mis à jour.',
    category: 'info',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm'),
    read: false,
  },
  {
    id: '3',
    title: '⚠️ Urgence',
    message: 'Incident signalé en zone B. Merci de rester vigilant.',
    category: 'urgent',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm'),
    read: true,
  },
];

export const useDataStore = create<DataState>((set, get) => ({
  shifts: mockShifts,
  checkIns: [],
  notifications: mockNotifications,
  incidents: [],
  employees: mockEmployees,
  performance: {
    totalHours: 156,
    shiftsCompleted: 18,
    punctualityScore: 95,
    performanceScore: 92,
    weeklyHours: [
      { day: 'Lun', hours: 8 },
      { day: 'Mar', hours: 7.5 },
      { day: 'Mer', hours: 8 },
      { day: 'Jeu', hours: 8 },
      { day: 'Ven', hours: 7 },
      { day: 'Sam', hours: 4 },
      { day: 'Dim', hours: 0 },
    ],
  },
  currentStatus: 'absent',

  checkIn: (location?: GeoLocation) => {
    const now = new Date();
    const newCheckIn: CheckInOut = {
      id: Date.now().toString(),
      date: format(now, 'yyyy-MM-dd'),
      checkIn: format(now, 'HH:mm'),
      status: 'present',
      checkInLocation: location,
    };

    set((state) => ({
      checkIns: [newCheckIn, ...state.checkIns],
      currentStatus: 'present',
    }));
  },

  checkOut: (location?: GeoLocation) => {
    const now = new Date();
    const checkIns = get().checkIns;
    const lastCheckIn = checkIns[0];

    if (lastCheckIn && !lastCheckIn.checkOut) {
      // Calculate real work duration
      const checkInTime = new Date(`${lastCheckIn.date}T${lastCheckIn.checkIn}`);
      const checkOutTime = now;
      let totalMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / 60000);
      
      // Subtract pause duration if exists
      if (lastCheckIn.pauseStart && lastCheckIn.pauseEnd) {
        const pauseStart = new Date(`${lastCheckIn.date}T${lastCheckIn.pauseStart}`);
        const pauseEnd = new Date(`${lastCheckIn.date}T${lastCheckIn.pauseEnd}`);
        const pauseMinutes = Math.floor((pauseEnd.getTime() - pauseStart.getTime()) / 60000);
        totalMinutes -= pauseMinutes;
      }
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const duration = `${hours}h ${minutes.toString().padStart(2, '0')}min`;

      const updated = {
        ...lastCheckIn,
        checkOut: format(now, 'HH:mm'),
        status: 'completed' as const,
        duration,
        checkOutLocation: location,
      };

      set((state) => ({
        checkIns: [updated, ...state.checkIns.slice(1)],
        currentStatus: 'absent',
      }));
    }
  },

  togglePause: () => {
    const now = new Date();
    const checkIns = get().checkIns;
    const lastCheckIn = checkIns[0];
    const currentStatus = get().currentStatus;

    if (currentStatus === 'present' && lastCheckIn && !lastCheckIn.checkOut) {
      // Starting pause
      const updated = {
        ...lastCheckIn,
        pauseStart: format(now, 'HH:mm'),
      };
      set((state) => ({
        checkIns: [updated, ...state.checkIns.slice(1)],
        currentStatus: 'pause',
      }));
    } else if (currentStatus === 'pause' && lastCheckIn && lastCheckIn.pauseStart && !lastCheckIn.pauseEnd) {
      // Ending pause
      const pauseStart = new Date(`${lastCheckIn.date}T${lastCheckIn.pauseStart}`);
      const pauseEnd = now;
      const pauseMinutes = Math.floor((pauseEnd.getTime() - pauseStart.getTime()) / 60000);
      const hours = Math.floor(pauseMinutes / 60);
      const minutes = pauseMinutes % 60;
      const pauseDuration = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

      const updated = {
        ...lastCheckIn,
        pauseEnd: format(now, 'HH:mm'),
        pauseDuration,
      };
      set((state) => ({
        checkIns: [updated, ...state.checkIns.slice(1)],
        currentStatus: 'present',
      }));
    }
  },

  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  addIncident: (incident) => {
    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString(),
      date: format(new Date(), 'yyyy-MM-dd HH:mm'),
      status: 'pending',
    };

    set((state) => ({
      incidents: [newIncident, ...state.incidents],
    }));
  },

  updateShiftStatus: (id: string, status: 'upcoming' | 'ongoing' | 'completed', photos?: string[]) => {
    set((state) => ({
      shifts: state.shifts.map((shift) =>
        shift.id === id ? { ...shift, status, completionPhotos: photos || shift.completionPhotos } : shift
      ),
    }));
  },

  addShiftComment: (id: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Admin User', // Mock data - sera remplacé par l'utilisateur connecté
      authorAvatar: undefined,
      date: format(new Date(), 'yyyy-MM-dd HH:mm'),
      text,
    };

    set((state) => ({
      shifts: state.shifts.map((shift) =>
        shift.id === id 
          ? { ...shift, comments: [...(shift.comments || []), newComment] } 
          : shift
      ),
    }));
  },
}));
