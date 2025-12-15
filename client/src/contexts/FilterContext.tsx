import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<string>('2025');

  return (
    <FilterContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
