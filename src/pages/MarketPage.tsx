import { KeyboardBackspace } from "@mui/icons-material"
import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Avatar, AvatarGroup, Badge, Card, Paper, Skeleton, Stack, Tooltip } from "@mui/material"
import query from "../api/market"
import { formatNumber, wait } from "../utils/utils"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"
import { RadialPercentage } from "../components/RadialPercentage"
import { $loading } from "../stores/app"
import { Link, NavLink, useParams } from "react-router-dom"
import { $marketMap, getMarketById } from "../stores/markets"
import { useStore } from "@nanostores/react"
import { AnimatedList } from "../components/AnimatedList"

export function MarketPage({show}: any) {
  const { marketId } = useParams()
  const market = useStore(getMarketById(marketId))

  console.log(market)

  useEffect(() => {
    if (!marketId || market) return

    $loading.set(true)
    Promise.all([query(marketId), wait(1_000)]).then(([market]) => {
      $marketMap.setKey(marketId, market)
      $loading.set(false)
    })
  }, [marketId, market])

  return (
    <AnimatedList gap={2} justifyContent="flex-start" alignItems="flex-start" show={show}>
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
    </AnimatedList>
  )
}
