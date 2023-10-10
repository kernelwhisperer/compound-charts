import React from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { HomePage } from "./pages/HomePage"
import { CompoundLogo } from "./components/CompoundLogo"
import { Stack } from "@mui/material"
import { Route, Routes, useLocation } from "react-router-dom"
import { MarketPage } from "./pages/MarketPage"
import { AnimatedList } from "./components/AnimatedList"
import { useTransition, a } from "@react-spring/web"

const SHOW_STATE = { opacity: 1, x: 0, pointerEvents: "unset" }
const HIDE_STATE = { opacity: 0, x: -60, pointerEvents: "none" }

export default function App() {
  const location = useLocation()
  console.log("📜 LOG > App > location:", location)

  const transitions = useTransition(location, {
    config: { friction: 200, mass: 5, tension: 2000 },
    keys: (location) => location.pathname,
    from: SHOW_STATE,
    enter: SHOW_STATE,
    leave: HIDE_STATE,
    exitBeforeEnter: true,
    immediate: true,
    delay: 250,
  })

  return (
    <>
      <div id="dot-grid" />
      <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
        <>
          <Typography variant="h2" fontFamily="'Roboto Serif', serif" sx={{ paddingBottom: 6 }}>
            <Stack direction="row" gap={1} flexWrap={"wrap"}>
              <CompoundLogo />
              <span>Compound</span>
              <span>×</span>
              <span>EthGlobal</span>
            </Stack>
          </Typography>
        </>
        {transitions((styles, item) => (
          <a.div style={{ ...styles, position: "absolute", maxWidth: 1200 } as any}>
            <Routes location={item}>
              <Route path="/" element={<HomePage show={location.pathname === "/"} />} />
              <Route path="/:marketId" element={<MarketPage show={location.pathname !== "/"} />} />
            </Routes>
          </a.div>
        ))}
      </Container>
    </>
  )
}
