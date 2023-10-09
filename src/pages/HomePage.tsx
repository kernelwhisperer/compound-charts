import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import { Avatar, AvatarGroup, Badge, Paper, Stack, Tooltip } from "@mui/material"
import query from "../api/markets"
import { formatNumber } from "../utils/utils"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"

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
          {usdValue} USD
        </Typography>
      )}
    </>
  )
}

export function HomePage() {
  const [markets, setMarkets] = useState<any[]>([])
  console.log(markets?.[0])

  useEffect(() => {
    query().then(setMarkets)
  }, [setMarkets])

  return (
    <>
      {markets.length === 0 ? (
        <Typography>Loading...</Typography>
      ) : (
        <Stack gap={2} direction="row" flexWrap="wrap" justifyContent="center">
          {markets.map((x) => (
            <Paper
              variant="outlined"
              sx={{
                padding: 2,
                minWidth: 360,
                "@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))": {
                  backdropFilter: "blur(2px)",
                },
              }}
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
                      x.accounting.totalBaseSupply / 10 ** x.configuration.baseToken.token.decimals,
                      2,
                      "compact"
                    )}
                    tokenSymbol={x.configuration.baseToken.token.symbol}
                    usdValue={formatNumber(x.accounting.totalBaseSupplyUsd, 2, "compact")}
                  />
                  <Statistic
                    label="Borrowed"
                    value={formatNumber(
                      x.accounting.totalBaseBorrow / 10 ** x.configuration.baseToken.token.decimals,
                      2,
                      "compact"
                    )}
                    tokenSymbol={x.configuration.baseToken.token.symbol}
                    usdValue={formatNumber(x.accounting.totalBaseBorrowUsd, 2, "compact")}
                  />
                </Stack>
                <Statistic
                  label="Utilization"
                  value={`${formatNumber(x.accounting.utilization * 100, 2)}%`}
                />
                <Typography></Typography>
                {/* <Typography fontFamily={RobotoMonoFF}>
                  Collateral {formatNumber(x.accounting.collateralBalanceUsd, 2, "compact")} USD{" "}
                </Typography> */}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </>
  )
}
