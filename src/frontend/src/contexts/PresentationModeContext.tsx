import { createContext, useContext, useState, ReactNode } from 'react';

interface PresentationModeContextType {
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
}

const PresentationModeContext = createContext<PresentationModeContextType | undefined>(undefined);

export function PresentationModeProvider({ children }: { children: ReactNode }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const togglePresentationMode = () => {
    setIsPresentationMode(prev => !prev);
  };

  return (
    <PresentationModeContext.Provider value={{ isPresentationMode, togglePresentationMode }}>
      {children}
    </PresentationModeContext.Provider>
  );
}

export function usePresentationMode() {
  const context = useContext(PresentationModeContext);
  if (context === undefined) {
    throw new Error('usePresentationMode must be used within a PresentationModeProvider');
  }
  return context;
}
