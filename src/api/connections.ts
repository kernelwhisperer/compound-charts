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

export const allClients = [
  ethClient,
  arbClient,
  polygonClient,
  baseClient
]
