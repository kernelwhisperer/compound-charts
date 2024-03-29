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
import { $loading, $timeRange } from "../stores/app"
import { Link, NavLink, useParams } from "react-router-dom"
import { $markets, getMarketById } from "../stores/markets"
import { useStore } from "@nanostores/react"
import { AnimatedList } from "../components/AnimatedList"
import { Chart } from "../components/Chart"
import queryDailyUsage from "../api/daily-usage"
import queryProtocolDailyUsage from "../api/daily-protocol-usage"

export function UsagePage({ show, protocol }: any) {
  const { networkIndex = "0", marketId } = useParams()
  const market = useStore(getMarketById(parseInt(networkIndex), marketId))

  const [stats, setStats] = useState<any>()
  const markets = useStore($markets)

  useEffect(() => {
    if (!protocol && (!market || !marketId)) return
    if (protocol && !markets) return

    $loading.set(true)
    $timeRange.set(undefined)

    Promise.all([
      protocol ? queryProtocolDailyUsage(markets) : queryDailyUsage(market.networkIndex, marketId as any),
      wait(1_000),
    ]).then(([usage]) => {
      setStats(usage)
      $loading.set(false)
    })
  }, [market, markets, protocol])

  return (
    <AnimatedList gap={2} show={show}>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Transactions
        </Typography>
        {stats ? (
          <Chart data={stats.txns} significantDigits={0} unitLabel="txns" />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Daily unique users
        </Typography>
        {stats ? (
          <Chart data={stats.uniqueUsers} significantDigits={0} unitLabel="users" />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Inflows and outflows
        </Typography>
        {stats ? (
          <Chart
            diffMode
            data={stats.inflows}
            secondData={stats.outflows}
            significantDigits={0}
            unitLabel="inflows"
            dataLabel="Netflows (inflows-outflows) "
          />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
    </AnimatedList>
  )
}
