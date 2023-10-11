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
          main: "#fff",
        },
        secondary: {
          main: "#00d395",
        },
        background: {
          default: "rgb(42, 45, 53)",
          paper: "rgba(38, 41, 49, 0.8)",
        },
        Tooltip: {
          bg: "#fff",
        },
      },
    },
  },
  transitions: {
    easing: {
      // sharp: "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
    },
  },
  shape: {
    borderRadius: 6
  }
})
// console.log("📜 LOG > theme:", theme)

export const RobotoSerifFF = "'Roboto Serif', serif"
export const RobotoMonoFF = "'Roboto Mono', monospace"

export default theme
