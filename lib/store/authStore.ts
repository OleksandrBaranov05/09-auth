import { create } from 'zustand';
import type { User } from '@/types/user';

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (val: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
