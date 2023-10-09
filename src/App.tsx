import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import query from "./api/markets"
import { Avatar, AvatarGroup, Badge, Stack, Tooltip } from "@mui/material"

export default function App() {
  const [markets, setMarkets] = useState<any[]>([])
  console.log("📜 LOG > App > markets:", markets)

  useEffect(() => {
    query().then(setMarkets)
  }, [setMarkets])

  return (
    <>
      <div id="dot-grid"></div>
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <Stack gap={4}>
          <Typography variant="h2" fontFamily="'Roboto Serif', serif">
            Compound × EthGlobal
          </Typography>
          {markets.length === 0 ? (
            <Typography>Loading...</Typography>
          ) : (
            markets.map((x) => (
              <div>
                <Stack gap={1} direction="row" alignItems="flex-start">
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
                  <AvatarGroup></AvatarGroup>
                  <Stack>
                    <Typography variant="h5" fontFamily="'Roboto Serif', serif">
                      {x.configuration.baseToken.token.name}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      fontFamily="'Roboto Serif', serif"
                    >
                      Ethereum
                    </Typography>
                  </Stack>
                </Stack>
                <pre>{JSON.stringify(x, null, 2)}</pre>
              </div>
            ))
          )}
        </Stack>
      </Container>
    </>
  )
}
