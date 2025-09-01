import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Loading from '../components/Loading';

interface GlobalContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout(() => setIsLoading(false), 1000);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GlobalContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <Loading />}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};