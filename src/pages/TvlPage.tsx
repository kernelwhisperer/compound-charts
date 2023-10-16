import { KeyboardBackspace } from "@mui/icons-material"
import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Avatar, AvatarGroup, Badge, Card, Paper, Skeleton, Stack } from "@mui/material"
import { formatNumber, mergeAndReverse, wait } from "../utils/utils"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"
import { RadialPercentage } from "../components/RadialPercentage"
import { $loading, $timeRange } from "../stores/app"
import { Link, NavLink, useParams } from "react-router-dom"
import { $markets, getMarketById } from "../stores/markets"
import { useStore } from "@nanostores/react"
import { AnimatedList } from "../components/AnimatedList"
import { Chart } from "../components/Chart"
import queryDailyAccounting from "../api/daily-accounting"
import queryProtocolDailyAccounting from "../api/daily-protocol-accounting"

export function TvlPage({ show, protocol }: any) {
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
        ? queryProtocolDailyAccounting(markets)
        : queryDailyAccounting(market.networkIndex, marketId as any),
      wait(1_000),
    ]).then(([stats]) => {
      const supply = stats.supply.reverse()
      const collateral = stats.collateral.reverse()
      const borrow = stats.borrow.map((x) => ({ ...x, value: x.value * -1 })).reverse()

      setStats({
        tvl: mergeAndReverse([{ foo: supply }, { foo: collateral }], "foo"),
        tvlExclBorrows: mergeAndReverse(
          [{ foo: supply }, { foo: collateral }, { foo: borrow }],
          "foo"
        ),
      })
      $loading.set(false)
    })
  }, [market, markets, protocol])

  return (
    <AnimatedList gap={2} show={show}>
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
