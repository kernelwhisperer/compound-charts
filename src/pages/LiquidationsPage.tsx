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
import queryMarkets from "../api/markets"
import queryLiquidations from "../api/liquidations"

import EnhancedTable from "../components/EnhancedTable"

const headCells: any[] = [
  {
    id: "timestamp",
    label: "Timestamp",
  },
  {
    id: "networkIndex",
    label: "Network",
  },
  {
    id: "hash",
    label: "Tx hash",
  },
  {
    id: "absorber",
    label: "Liquidator",
  },
  {
    id: "lastPriceUsd",
    label: "Liquidation price",
    numeric: true,
  },
  {
    id: "absorbCollateralInteractions",
    label: "Collateral",
    numeric: true,
  },
  {
    id: "amountUsd",
    label: "Collateral value",
    numeric: true,
  },
]

export function LiquidationsPage({ show, protocol = true }: any) {
  const [liquidations, setLiquidations] = useState<any[]>([])

  useEffect(() => {
    if ($markets.get().length) return

    Promise.all([queryMarkets(), wait(1_000)]).then(([markets]) => {
      $markets.set(markets)
    })

    Promise.all([queryLiquidations(), wait(1_000)]).then(([liquidations]) => {
      setLiquidations(liquidations as any[])
    })
  }, [])

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
      protocol
        ? queryProtocolDailyUsage(markets)
        : queryDailyUsage(market.networkIndex, marketId as any),
      wait(1_000),
    ]).then(([usage]) => {
      setStats(usage)
      $loading.set(false)
    })
  }, [market, markets, protocol])

  return (
    <AnimatedList gap={2} show={show}>
      <div>
        {stats ? (
          <Chart data={stats.liquidations} significantDigits={0} unitLabel="liquidations" />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>

      {liquidations.length ? (
        <EnhancedTable rows={liquidations} headCells={headCells} />
      ) : (
        <Skeleton key={1} variant="rounded" height={544} width={"100%"} />
      )}
    </AnimatedList>
  )
}
