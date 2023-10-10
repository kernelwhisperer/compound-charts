import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Avatar, AvatarGroup, Badge, Card, Paper, Skeleton, Stack } from "@mui/material"
import queryMarkets from "../api/markets"
import { formatNumber, wait } from "../utils/utils"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"
import { RadialPercentage } from "../components/RadialPercentage"
import { $loading } from "../stores/app"
import { Link, NavLink, useLocation } from "react-router-dom"
import { $markets } from "../stores/markets"
import { useStore } from "@nanostores/react"
import { AnimatedList } from "../components/AnimatedList"
import { Tooltip } from "../components/Tooltip"

export function Statistic({ label, value, tokenSymbol, usdValue }: any) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography>{label}</Typography>
        <Box
          sx={{
            flexGrow: 1,
            backgroundImage:
              "radial-gradient(circle,  rgba(128,128,128,0.5) 1px,  rgba(128,128,128,0.5) 1px, transparent 1px)",
            backgroundSize: "8px 14px",
            height: "8px",
            margin: "0 8px",
          }}
        ></Box>
        <Typography fontFamily={RobotoMonoFF} component="span">
          {value}{" "}
          {tokenSymbol && (
            <Stack
              direction="row"
              gap={0.5}
              alignItems="baseline"
              sx={{ display: "inline-flex" }}
              component="span"
            >
              <Avatar
                sx={{ width: 16, height: 16, alignSelf: "center" }}
                src={`https://app.compound.finance/images/assets/asset_${tokenSymbol}.svg`}
              />
              <span>{tokenSymbol}</span>
            </Stack>
          )}
        </Typography>
      </Stack>
      {usdValue && (
        <Typography
          fontFamily={RobotoMonoFF}
          component="span"
          color="text.secondary"
          sx={{ textAlign: "end" }}
          variant="caption"
        >
          ≈{usdValue} USD
        </Typography>
      )}
    </>
  )
}

export function HomePage({ show }: any) {
  const markets = useStore($markets)

  useEffect(() => {
    if ($markets.get().length) return

    $loading.set(true)
    Promise.all([queryMarkets(), wait(1_000)]).then(([markets]) => {
      $markets.set(markets)
      $loading.set(false)
    })
  }, [])

  return (
    <AnimatedList gap={2} direction="row" flexWrap="wrap" show={show}>
      {markets.length === 0
        ? [
            <Skeleton key={0} variant="rounded" height={240} width={360} />,
            <Skeleton key={1} variant="rounded" height={240} width={360} />,
            <Skeleton key={2} variant="rounded" height={240} width={360} />,
            <Skeleton key={3} variant="rounded" height={240} width={360} />,
            <Skeleton key={4} variant="rounded" height={240} width={360} />,
            <Skeleton key={5} variant="rounded" height={240} width={360} />,
          ]
        : markets.map((x) => (
            <Tooltip title="Open detailed usage and accounting view.">
              <Card
                component={Link}
                to={`/${x.configuration.id}`}
                variant="outlined"
                sx={(theme) => ({
                  transition: theme.transitions.create(["transform", "background-color"], {
                    duration: theme.transitions.duration.shortest,
                    // easing: theme.transitions.easing.sharp
                  }),
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor:
                      "rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))",
                    // transform: "scale(1)",
                  },
                  "&:active": {
                    transform: "scale(0.985)",
                  },
                  padding: 2,
                  display: "inherit",
                  minWidth: 360,
                  "@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))": {
                    backdropFilter: "blur(2px)",
                  },
                })}
                key={x.configuration.symbol}
              >
                <Stack gap={2}>
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
                        src={`https://app.compound.finance/images/assets/asset_${x.configuration.baseToken.token.symbol}.svg`}
                      />
                    </Badge>
                    <Stack>
                      <Typography variant="h5" fontFamily={RobotoSerifFF}>
                        {x.configuration.baseToken.token.name}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="subtitle2"
                        fontFamily={RobotoSerifFF}
                      >
                        Ethereum
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack gap={0.5}>
                    <Statistic
                      label="Supplied"
                      value={formatNumber(
                        x.accounting.totalBaseSupply /
                          10 ** x.configuration.baseToken.token.decimals,
                        2,
                        "compact"
                      )}
                      tokenSymbol={x.configuration.baseToken.token.symbol}
                      usdValue={formatNumber(x.accounting.totalBaseSupplyUsd, 2, "compact")}
                    />
                    <Statistic
                      label="Borrowed"
                      value={formatNumber(
                        x.accounting.totalBaseBorrow /
                          10 ** x.configuration.baseToken.token.decimals,
                        2,
                        "compact"
                      )}
                      tokenSymbol={x.configuration.baseToken.token.symbol}
                      usdValue={formatNumber(x.accounting.totalBaseBorrowUsd, 2, "compact")}
                    />
                    <Statistic
                      label="Utilization"
                      value={
                        <>
                          <RadialPercentage percentage={x.accounting.utilization} />
                          {formatNumber(x.accounting.utilization * 100, 2)}%
                        </>
                      }
                    />
                  </Stack>
                  {/* <Typography fontFamily={RobotoMonoFF}>
                  Collateral {formatNumber(x.accounting.collateralBalanceUsd, 2, "compact")} USD{" "}
                </Typography> */}
                </Stack>
              </Card>
            </Tooltip>
          ))}
    </AnimatedList>
  )
}
