import React from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { HomePage } from "./pages/HomePage"
import { CompoundLogo } from "./components/CompoundLogo"
import { Stack } from "@mui/material"

export default function App() {
  return (
    <>
      <div id="dot-grid" />
      <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
        <>
          <Typography
            variant="h2"
            fontFamily="'Roboto Serif', serif"
            sx={{ paddingBottom: 6 }}
          >
            <Stack direction="row" justifyContent={"center"} gap={1} flexWrap={"wrap"}>
              <CompoundLogo />
              <span>Compound</span>
              <span>×</span>
              <span>EthGlobal</span>
            </Stack>
          </Typography>
        </>
        <HomePage />
      </Container>
    </>
  )
}
