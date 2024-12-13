import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E282D', // Blue color WAS 00ADF5
    accent: '#ffffff', // White color
    background: '#ffffff', // White background
    surface: '#ffffff', // White surface
    text: '#000000', // Black text
    placeholder: '#888888', // Grey placeholder text
    error: '#f00', // Red color for errors
  },
};

export default theme;