import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00adf5', // Blue color
    accent: '#ffffff', // White color
    background: '#ffffff', // White background
    surface: '#ffffff', // White surface
    text: '#000000', // Black text
    placeholder: '#888888', // Grey placeholder text
    error: '#f00', // Red color for errors
  },
};

export default theme;