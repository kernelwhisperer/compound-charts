import { createTheme } from '@mui/material/styles';

import {
  experimental_extendTheme as extendTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles';

// A custom theme for this app
const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "#444"
        }
      }
    }
  }
});

export default theme;
