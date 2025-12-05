import { create } from "zustand";

interface ErrorStore {
  errors: any[];
  addError: (any) => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],
  addError: (error) => {
    set((state) => ({
      errors: [...state.errors, error],
    }));
  },
}));
