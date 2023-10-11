import { KeyboardBackspace } from "@mui/icons-material"
import { Button, Tab, Tabs, tabsClasses } from "@mui/material"
import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Avatar, AvatarGroup, Badge, Card, Paper, Skeleton, Stack } from "@mui/material"
import { formatNumber, wait } from "../utils/utils"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"
import { RadialPercentage } from "../components/RadialPercentage"
import { $loading, $timeRange } from "../stores/app"
import { Link, NavLink, useParams } from "react-router-dom"
import { $markets, getMarketById } from "../stores/markets"
import { useStore } from "@nanostores/react"
import { AnimatedList } from "../components/AnimatedList"
import { Chart } from "../components/Chart"
import queryMarkets from "../api/markets"
import queryDailyUsage from "../api/daily-usage"
import { UsagePage } from "./UsagePage"
import { AccountingPage } from "./AccountingPage"
import { a, useTransition } from "@react-spring/web"

export function MarketPage({ show }: any) {
  const { marketId } = useParams()
  const market = useStore(getMarketById(marketId))

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
      <Button
        component={Link}
        to="/"
        size="small"
        color="primary"
        sx={{
          borderRadius: 16,
          height: 31,
          paddingLeft: 1,
          paddingRight: 2,
          textTransform: "none",
        }}
        startIcon={<KeyboardBackspace />}
      >
        Markets
      </Button>
      {market && (
        <Stack gap={2} direction="row" justifyContent="space-between" alignItems={"flex-start"}>
          <Stack gap={2} direction="row" alignItems="flex-start">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    border: "2px solid var(--mui-palette-background-default)",
                  }}
                  src={`https://app.compound.finance/images/assets/asset_ETHEREUM.svg`}
                />
              }
            >
              <Avatar
                sx={{ width: 48, height: 48 }}
                src={`https://app.compound.finance/images/assets/asset_${market.configuration.baseToken.token.symbol}.svg`}
              />
            </Badge>
            <Stack>
              <Typography variant="h5" fontFamily={RobotoSerifFF}>
                {market.configuration.baseToken.token.name}
              </Typography>
              <Typography color="text.secondary" variant="subtitle2" fontFamily={RobotoSerifFF}>
                Ethereum
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
                background: "#8f66ff80",
              },
              [`& .${tabsClasses.flexContainer} > button`]: {
                zIndex: 2,
                textTransform: "none !important",
                minHeight: 38,
              },
            }}
          >
            <Tab label="Usage" disableRipple />
            <Tab label="Accounting" disableRipple />
          </Tabs>
        </Stack>
      )}
      {!market && <Skeleton variant="rounded" height={57.5} width={300} />}
      {transitions((_styles, item) =>
        item === 0 ? (
          <UsagePage key={"usage"} show={tabIndex === 0} />
        ) : (
          <AccountingPage key={"accounting"} show={tabIndex === 1} />
        )
      )}
    </AnimatedList>
  )
}
