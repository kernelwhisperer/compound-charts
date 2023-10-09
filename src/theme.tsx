import {
  experimental_extendTheme as extendTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles"

// A custom theme for this app
const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "#444",
        },
        background: {
          default: "rgb(42, 45, 53)",
          paper: "rgba(38, 41, 49, 0.8)"
        },
      },
    },
  },
})

export const RobotoSerifFF = "'Roboto Serif', serif"
export const RobotoMonoFF = "'Roboto Mono', monospace"

export default theme
