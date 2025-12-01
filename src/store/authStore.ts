import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  matricule: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication
        if (email === 'admin@gmail.com' && password === 'admin') {
          const mockUser: User = {
            id: '1',
            email: 'admin@gmail.com',
            name: 'Jean Dupont',
            role: 'Employé',
            matricule: 'EMP-2024-001',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
            phone: '+33 6 12 34 56 78',
            address: '123 Rue de la Paix, Paris',
          };

          set({
            user: mockUser,
            token: 'mock-jwt-token',
            isAuthenticated: true,
          });

          return { success: true };
        }

        return { success: false, error: 'Email ou mot de passe incorrect' };
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'ichbin-auth',
    }
  )
);
