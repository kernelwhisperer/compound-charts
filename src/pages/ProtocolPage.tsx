import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Avatar, AvatarGroup, Badge, Card, Paper, Skeleton, Stack, Tab, Tabs, tabsClasses } from "@mui/material"
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

export function ProtocolPage({ show }: any) {
  const markets = useStore($markets)

  const [stats, setStats] = useState<any>()

  useEffect(() => {
    if ($markets.get().length) return

    Promise.all([queryMarkets(), wait(1_000)]).then(([markets]) => {
      $markets.set(markets)
    })
  }, [])

  useEffect(() => {
    if (!markets.length) return

    $loading.set(true)
    $timeRange.set(undefined)
    queryDailyAccounting(markets).then((stats) => {
      setStats(stats)
      $loading.set(false)
    })
  }, [markets])

  
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <AnimatedList gap={2} show={show}>
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
          <Tab label="TVL" disableRipple />
          <Tab label="Usage" disableRipple />
        </Tabs>
      </Stack>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Total value locked
        </Typography>
        {stats ? (
          <Chart
            data={stats.tvl}
            significantDigits={2}
            compact
            unitLabel="USD"
            dataLabel="TVL"
            areaSeries
            chartOpts={{ lineType: 2 }}
          />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Total value locked (excl. borrows)
        </Typography>
        {stats ? (
          <Chart
            data={stats.tvlExclBorrows}
            significantDigits={2}
            compact
            unitLabel="USD"
            dataLabel="TVL"
            areaSeries
            chartOpts={{ lineType: 2 }}
          />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
    </AnimatedList>
  )
}
