import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material"
import theme from "./theme"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>
)
