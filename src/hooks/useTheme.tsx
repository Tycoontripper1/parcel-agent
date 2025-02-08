import {darkTheme, lightTheme} from '@/constants/themes';
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  headerText: string;
  headerBackground: string;
  border: string;
  rowBackground: string;
  alternateRowBackground: string;
  inputText: string;
};

type ThemeContextType = {
  theme: Theme;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = 'APP_THEME_MODE'; // Key to store theme mode in AsyncStorage

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Load saved theme mode from AsyncStorage when the app initializes
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode === 'light' || savedMode === 'dark') {
          setMode(savedMode); // Set mode based on saved value
        }
      } catch (error) {
        console.error('Failed to load theme mode from AsyncStorage:', error);
      }
    };
    loadTheme();
  }, []);

  // Toggle theme and save the selected mode to AsyncStorage
  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode); // Save mode to AsyncStorage
    } catch (error) {
      console.error('Failed to save theme mode to AsyncStorage:', error);
    }
  };

  const value: ThemeContextType = {
    theme: mode === 'light' ? lightTheme : darkTheme,
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
