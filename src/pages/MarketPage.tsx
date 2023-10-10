import { KeyboardBackspace } from "@mui/icons-material"
import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Avatar, AvatarGroup, Badge, Card, Paper, Skeleton, Stack } from "@mui/material"
import { formatNumber, wait } from "../utils/utils"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"
import { RadialPercentage } from "../components/RadialPercentage"
import { $loading } from "../stores/app"
import { Link, NavLink, useParams } from "react-router-dom"
import { $markets, getMarketById } from "../stores/markets"
import { useStore } from "@nanostores/react"
import { AnimatedList } from "../components/AnimatedList"
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Chart } from "../components/Chart"
import queryMarkets from "../api/markets"
import queryDailyUsage from "../api/daily-usage"

export function MarketPage({ show }: any) {
  const { marketId } = useParams()
  const market = useStore(getMarketById(marketId))

  const [usageStats, setUsageStats] = useState<any>()
  console.log("📜 LOG > MarketPage > usageStats:", usageStats)

  console.log(market)

  useEffect(() => {
    if ($markets.get().length) return

    $loading.set(true)
    Promise.all([queryMarkets(), wait(1_000)]).then(([markets]) => {
      $markets.set(markets)
      $loading.set(false)
    })
  }, [])

  useEffect(() => {
    if (!market || !marketId) return

    $loading.set(true)
    Promise.all([queryDailyUsage(marketId), wait(1_000)]).then(([usage]) => {
      setUsageStats(usage)
      $loading.set(false)
    })
  }, [market])

  return (
    <AnimatedList gap={2} show={show}>
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
      )}
      {!market && [<Skeleton key={0} variant="rounded" height={54} width={300} />]}
      {/* {market && (
        <ResponsiveContainer minWidth={400} width={"100%"} height={400}>
          <BarChart data={market.dailyUsage}>
            <Bar dataKey="usage.uniqueUsersCount" fill="#8884d8" />
            <XAxis
              scale="time"
              type="number"
              dataKey="timestamp"
              domain={['dataMin', 'dataMax']}
              // axisLine={false}
              // tickLine={false}
              // interval={0}
              // // tick={renderQuarterTick}
              // height={1}
              // scale="band"
              // xAxisId="quarter"
            
            />
            <YAxis orientation="right" domain={[0, 'dataMax + 20']}/>
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      )} */}

      <Typography variant="h6" fontFamily={RobotoSerifFF}>
        Daily unique users
      </Typography>
      {usageStats ? (
        <Chart data={usageStats.dailyUsage} significantDigits={0} unitLabel="" />
      ) : (
        <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
      )}
    </AnimatedList>
  )
}
