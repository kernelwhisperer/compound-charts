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
import queryMarkets from "../api/markets"
import queryDailyInterest from "../api/daily-interest"
import queryProtocolDailyInterest from "../api/daily-protocol-interest"

export function InterestPage({ show, protocol }: any) {
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
        ? queryProtocolDailyInterest(markets)
        : queryDailyInterest(market.networkIndex, marketId as any),
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
          Earn APR
        </Typography>
        {stats ? (
          <Chart
            data={stats.netSupplyApr}
            secondData={stats.supplyApr}
            significantDigits={2}
            compact
            unitLabel="%"
            dataLabel="Net Earn APR (incl. rewards)"
            secondDataLabel="Earn APR"
            areaSeries
            chartOpts={{
              lineColor: "rgba(255, 223, 0, 0.8)",
              topColor: "rgba(255, 223, 0, 0.13)",
              bottomColor: "rgba(255, 223, 0, 0)",
            }}
            secondChartOpts={{
              lineColor: "rgba(0, 211, 149, 0.8)",
              topColor: "rgba(0, 211, 149, 0.33)",
              bottomColor: "rgba(0, 211, 149, 0)",
            }}
          />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
      <div>
        <Typography variant="h6" fontFamily={RobotoSerifFF} gutterBottom>
          Borrow APR
        </Typography>
        {stats ? (
          <Chart
            data={stats.borrowApr}
            secondData={stats.netBorrowApr}
            significantDigits={2}
            compact
            unitLabel="%"
            secondDataLabel="Net Borrow APR (incl. rewards)"
            dataLabel="Borrow APR"
            areaSeries
            chartOpts={{
              lineColor: "rgba(128, 128, 128, 0.8)",
              topColor: "rgba(128, 128, 128, 0.1)",
              bottomColor: "rgba(255, 223, 0, 0)",
            }}
          />
        ) : (
          <Skeleton key={1} variant="rounded" height={400} width={"100%"} />
        )}
      </div>
    </AnimatedList>
  )
}
