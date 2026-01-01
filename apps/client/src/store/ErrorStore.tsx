import { create } from "zustand";

export enum ErrorType {
  FATAL,
  RECOVERABLE,
}

export interface Error {
  type: ErrorType;
  title: string;
  description: string;
}

interface ErrorStore {
  errors: Error[];
  addError: (error: Error) => void;
  reset: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],
  addError: (error) => {
    set((state) => ({
      errors: [...state.errors, error],
    }));
  },
  reset: () => {
    set({
      errors: [],
    });
  },
}));
