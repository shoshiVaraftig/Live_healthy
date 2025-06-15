// store/personalStore.ts
import { create } from 'zustand';
import type { PersonalArea } from '../types/personal';

interface PersonalStore {
  personalData: PersonalArea | null;
  setPersonalData: (data: PersonalArea) => void;
}

export const usePersonalStore = create<PersonalStore>((set) => ({
  personalData: null,
  setPersonalData: (data) => set({ personalData: data }),
}));
