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

export const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#AEFF8C',
  secondary: '#213264',
  border: '#E0E0E0',
  headerText: '#fff',
  headerBackground: '#007bff',
  rowBackground: '#fff',
  alternateRowBackground: '#f9f9f9',
  inputText: '#7B8794',
};

export const darkTheme: Theme = {
  background: '#121212',
  text: '#FFFFFF',
  primary: '#213264',
  secondary: '#AEFF8C',
  border: '#333333',
  headerText: '#000',
  headerBackground: '#1e1e1e',
  rowBackground: '#2c2c2c',
  alternateRowBackground: '#3a3a3a',
  inputText: '#7B8794',
};
