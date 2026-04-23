import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Region = 'US' | 'UK';
type Mode = 'dark' | 'light';
type ThemeKey = 'us-dark' | 'us-light' | 'uk-dark' | 'uk-light';

interface ThemeContextType {
  region: Region;
  mode: Mode;
  theme: ThemeKey;
  currency: string;
  setRegion: (r: Region) => void;
  toggleMode: () => void;
  isUK: boolean;
  isLight: boolean;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  complianceLabel: string;
  sdrRate: string;
  currencySymbol: string;
}

const ThemeContext = createContext<ThemeContextType>({
  region: 'US',
  mode: 'dark',
  theme: 'us-dark',
  currency: 'USD',
  setRegion: () => {},
  toggleMode: () => {},
  isUK: false,
  isLight: false,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  complianceLabel: 'TCPA',
  sdrRate: '$40.50',
  currencySymbol: '$',
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<Region>('US');
  const [mode, setMode] = useState<Mode>('dark');

  const theme: ThemeKey = `${region.toLowerCase()}-${mode}` as ThemeKey;
  const isUK = region === 'UK';
  const isLight = mode === 'light';
  const currency = isUK ? 'GBP' : 'USD';
  const currencySymbol = isUK ? '£' : '$';
  const dateFormat = isUK ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
  const timeFormat: '12h' | '24h' = isUK ? '24h' : '12h';
  const complianceLabel = isUK ? 'GDPR' : 'TCPA';
  const sdrRate = isUK ? '£28.50' : '$40.50';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setRegion = useCallback((r: Region) => setRegionState(r), []);
  const toggleMode = useCallback(() => setMode(prev => prev === 'dark' ? 'light' : 'dark'), []);

  return (
    <ThemeContext.Provider value={{
      region, mode, theme, currency, setRegion, toggleMode,
      isUK, isLight, dateFormat, timeFormat, complianceLabel, sdrRate, currencySymbol,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
