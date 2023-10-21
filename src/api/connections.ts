import { createClient, fetchExchange } from "urql/core"

const ethClient = createClient({
  exchanges: [fetchExchange],
  url: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3-mainnet",
  // url: "https://gateway-arbitrum.network.thegraph.com/api/6b4801789dca4e33fb0b7a051d93c910/subgraphs/id/5nwMCSHaTqG3Kd2gHznbTXEnZ9QNWsssQfbHhDqQSQFp",
})

const arbClient = createClient({
  exchanges: [fetchExchange],
  url: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3-arbitrum",
  // url: "https://gateway-arbitrum.network.thegraph.com/api/6b4801789dca4e33fb0b7a051d93c910/subgraphs/id/Ff7ha9ELmpmg81D6nYxy4t8aGP26dPztqD1LDJNPqjLS",
})

const polygonClient = createClient({
  exchanges: [fetchExchange],
  url: "https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3-polygon",
  // url: "https://gateway-arbitrum.network.thegraph.com/api/6b4801789dca4e33fb0b7a051d93c910/subgraphs/id/AaFtUWKfFdj2x8nnE3RxTSJkHwGHvawH3VWFBykCGzLs",
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
