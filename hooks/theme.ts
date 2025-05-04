// theme.ts
import { DefaultTheme as PaperDefault, configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '200',
    },
  },
};

export const theme = {
  ...PaperDefault,
  roundness: 8,
//   fonts: configureFonts(fontConfig),
  colors: {
    ...PaperDefault.colors,
    // background: '#ebebeb',
    primary: '#228B22',          // forest green
    accent: '#8B0000',           // dark red from your logo
    background: '#333333',       // dark gray for surfaces
    // surface: '#424242',          // slightly lighter gray
    text: '#FFFFFF',             // white-on-dark
    placeholder: 'rgb(204, 204, 204)',
    disabled: 'rgba(255,255,255,0.3)',
    // you can also add your own custom slots:
    success: '#4CAF50',
    warning: '#FF9800',
    error:   '#F44336',
  },
};
