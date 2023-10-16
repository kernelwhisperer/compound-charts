import React, { useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { HomePage } from "./pages/HomePage"
import { CompoundLogo } from "./components/CompoundLogo"
import { Link as MuiLink, Stack, Tab, Tabs, tabsClasses } from "@mui/material"
import { Link, Route, Routes, useLocation } from "react-router-dom"
import { AnimatedList } from "./components/AnimatedList"
import { useTransition, a } from "@react-spring/web"
import { MarketPage } from "./pages/MarketPage"
import { ProtocolPage } from "./pages/ProtocolPage"
import { RobotoSerifFF } from "./theme"

export default function App() {
  const location = useLocation()

  const transitions = useTransition(location, {
    keys: (location) => location.pathname,
    exitBeforeEnter: true,
    config: { friction: 160, mass: 5, tension: 2000 },
    from: { opacity: 0.9 },
    enter: { opacity: 1 },
    leave: { opacity: 0.9 },
  })

  return (
    <>
      <div id="dot-grid" />
      <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
        <>
          <Typography variant="h2" fontFamily="'Roboto Serif', serif">
            <Stack direction="row" gap={1} flexWrap={"wrap"}>
              <CompoundLogo />
              <span>Compound</span>
              <span>×</span>
              <span>EthGlobal</span>
            </Stack>
          </Typography>
          <Typography variant="caption" sx={{ marginLeft: 11, marginBottom: 5 }} component="div">
            Built with ❤️ by{" "}
            <MuiLink target="_blank" href="mailto:hello@danielconstantin.net">
              hello@danielconstantin.net
            </MuiLink>{" "}
            (open to work) for{" "}
            <MuiLink target="_blank" href="https://ethglobal.com/events/ethonline2023">
              EthGlobal 2023
            </MuiLink>{" "}
          </Typography>
        </>
        <Tabs
          value={location.pathname === "/" ? 0 : 1}
          sx={(theme) => ({
            marginBottom: 4,
            marginLeft: -2,
            [`& .${tabsClasses.indicator}`]: {
              borderRadius: 1000,
              bottom: 8,
              background: "rgba(0, 211, 149, 0.8)",
              height: 4,
              transform: "scaleX(0.7)",
            },
            [`& .${tabsClasses.flexContainer} > a`]: {
              zIndex: 2,
              textTransform: "none !important",
              minHeight: 38,
              transition: theme.transitions.create(["color", "background-color"]),
            },
          })}
        >
          <Tab
            label={
              <Typography variant="h6" fontFamily={RobotoSerifFF}>
                Protocol
              </Typography>
            }
            disableRipple
            to="/"
            component={Link}
          />
          <Tab
            label={
              <Typography variant="h6" fontFamily={RobotoSerifFF}>
                Markets
              </Typography>
            }
            disableRipple
            to="/markets"
            component={Link}
          />
        </Tabs>
        {transitions((styles, item) => (
          <a.div
            style={
              {
                ...styles,
                position: "absolute",
                maxWidth: 1200 - 48,
                width: "calc(100% - 48px)",
                paddingBottom: 16,
              } as any
            }
          >
            <Routes location={item}>
              <Route path="/" element={<ProtocolPage show={location.pathname === "/"} />} />
              <Route
                path="/markets"
                element={<HomePage show={location.pathname === "/markets"} />}
              />
              <Route
                path="/market/:networkIndex/:marketId"
                element={<MarketPage show={location.pathname.includes("/market/")} />}
              />
            </Routes>
          </a.div>
        ))}
      </Container>
    </>
  )
}
