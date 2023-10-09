import React from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { HomePage } from "./pages/HomePage"

export default function App() {
  return (
    <>
      <div id="dot-grid" />
      <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
        <>
          <Typography variant="h2" fontFamily="'Roboto Serif', serif" sx={{textAlign: "center", paddingBottom: 6}}>
            Compound × EthGlobal
          </Typography>
          <HomePage />
        </>
      </Container>
    </>
  )
}
