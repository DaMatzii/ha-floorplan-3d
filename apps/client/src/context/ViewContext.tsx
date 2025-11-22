import { createContext, useContext, useState, ReactNode } from "react";

interface ViewContextType {
  editorMode: boolean;
  setEditorMode: (value: boolean) => void;
  settingB: boolean;
  setSettingB: (value: boolean) => void;
}

interface InitialSettings {
  editorMode?: boolean;
  settingB?: boolean;
}

interface ViewContextProviderProps {
  children: ReactNode;
  initial: InitialSettings;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewContextProvider({
  children,
  initial,
}: ViewContextProviderProps) {
  const [editorMode, setEditorMode] = useState(initial.editorMode ?? false);
  const [settingB, setSettingB] = useState(initial.settingB ?? true);

  return (
    <ViewContext.Provider
      value={{ editorMode, setEditorMode, settingB, setSettingB }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export function useView(): ViewContextType {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewContextProvider");
  }
  return context;
}
