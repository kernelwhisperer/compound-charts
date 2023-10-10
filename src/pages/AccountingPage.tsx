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
import { Chart } from "../components/Chart"
import queryMarkets from "../api/markets"
import queryDailyAccounting from "../api/daily-accounting"

export function AccountingPage({ show }: any) {
  const { marketId } = useParams()
  const market = useStore(getMarketById(marketId))

  const [stats, setStats] = useState<any>()

  useEffect(() => {
    if (!market || !marketId) return

    $loading.set(true)
    Promise.all([queryDailyAccounting(marketId), wait(1_000)]).then(([usage]) => {
      setStats(usage)
      $loading.set(false)
    })
  }, [market])

  return (
    <AnimatedList gap={2} show={show}>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Supplied & borrowed
        </Typography>
        {stats ? (
          <Chart
            data={stats.supply}
            secondData={stats.borrow}
            significantDigits={2}
            compact
            unitLabel="USD"
          />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Collateral & borrowed
        </Typography>
        {stats ? (
          <Chart
            data={stats.collateral}
            secondData={stats.borrow}
            significantDigits={2}
            compact
            unitLabel="USD"
          />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
    </AnimatedList>
  )
}
