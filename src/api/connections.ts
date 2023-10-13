import { createClient, fetchExchange } from "urql/core"

const ethClient = createClient({
  exchanges: [fetchExchange],
  url: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3-mainnet",
})

const arbClient = createClient({
  exchanges: [fetchExchange],
  url: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3-arbitrum",
})

const polygonClient = createClient({
  exchanges: [fetchExchange],
  url: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3-polygon",
})

const baseClient = createClient({
  exchanges: [fetchExchange],
  url: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3-base",
})

export const NETWORK_LABELS = ["Ethereum", "Arbitrum", "Polygon", "Base"]
export const NETWORK_IMAGES = [
  "https://app.compound.finance/images/assets/asset_ETHEREUM.svg",
  "https://app.compound.finance/images/assets/asset_ARBITRUM-NETWORK.svg",
  "https://app.compound.finance/images/assets/asset_POLYGON.svg",
  "https://app.compound.finance/images/assets/asset_BASE_NETWORK.svg",
]

export const allClients = [ethClient, arbClient, polygonClient, baseClient]
