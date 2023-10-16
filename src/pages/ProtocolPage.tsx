import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  tabsClasses,
} from "@mui/material"
import queryMarkets from "../api/markets"
import { formatNumber, wait } from "../utils/utils"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"
import { RadialPercentage } from "../components/RadialPercentage"
import { $loading, $timeRange } from "../stores/app"
import { Link, NavLink, useLocation } from "react-router-dom"
import { $markets } from "../stores/markets"
import { useStore } from "@nanostores/react"
import { AnimatedList } from "../components/AnimatedList"
import { Tooltip } from "../components/Tooltip"
import { NETWORK_IMAGES, NETWORK_LABELS } from "../api/connections"
import { Chart } from "../components/Chart"
import queryDailyAccounting from "../api/daily-protocol-accounting"
import { a, useTransition } from "@react-spring/web"
import { UsagePage } from "./UsagePage"
import { DepositsPage } from "./DepositsPage"
import { TvlPage } from "./TvlPage"
import { InterestPage } from "./InterestPage"

export function ProtocolPage({ show }: any) {
  useEffect(() => {
    if ($markets.get().length) return

    Promise.all([queryMarkets(), wait(1_000)]).then(([markets]) => {
      $markets.set(markets)
    })
  }, [])

  const [tabIndex, setTabIndex] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  const transitions = useTransition(tabIndex, {
    exitBeforeEnter: true,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    immediate: true,
    delay: 250,
  })

  return (
    <AnimatedList gap={4} show={show}>
      <Stack gap={2} direction="row" justifyContent="space-between" alignItems={"flex-start"}>
        <Stack gap={2} direction="row" alignItems="center">
          <Avatar
            sx={{ width: 48, height: 48 }}
            src={"/comp_full.svg"}
            // src={`https://app.compound.finance/images/assets/asset_${market.configuration.baseToken.token.symbol}.svg`}
          />
          <Stack>
            <Typography variant="h5" fontFamily={RobotoSerifFF}>
              Compound v3
              {/* {market.configuration.baseToken.token.name} */}
            </Typography>
            <Typography color="text.secondary" variant="subtitle2" fontFamily={RobotoSerifFF}>
              Comet
            </Typography>
          </Stack>
        </Stack>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            background: "var(--mui-palette-background-paper)",
            borderRadius: 5,
            padding: 0.75,
            [`& .${tabsClasses.indicator}`]: {
              borderRadius: 5,
              height: "100%",
              background: "rgba(143, 102, 255, 0.8)",
            },
            [`& .${tabsClasses.flexContainer} > button`]: {
              zIndex: 2,
              textTransform: "none !important",
              minHeight: 38,
            },
          }}
        >
          <Tab label="Usage" disableRipple />
          <Tab label="Deposits" disableRipple />
          <Tab label="TVL" disableRipple />
          <Tab label="Interest rates" disableRipple />
        </Tabs>
      </Stack>
      {transitions((_styles, item) =>
        item === 0 ? (
          <UsagePage key={"usage"} show={tabIndex === 0} protocol />
        ) : item === 1 ? (
          <DepositsPage key={"deposits"} show={tabIndex === 1} protocol />
        ) : item === 2 ? (
          <TvlPage key={"tvl"} show={tabIndex === 2} protocol />
        ) : (
          <InterestPage key={"interest"} show={tabIndex === 3} protocol/>
        )
      )}
    </AnimatedList>
  )
}
