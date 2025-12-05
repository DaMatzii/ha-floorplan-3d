import { create } from "zustand";

interface ConfigStore {
  editorMode: boolean;
  setEditorMode: (mode: boolean) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  editorMode: false,
  setEditorMode: (mode) => set({ editorMode: mode }),
}));
