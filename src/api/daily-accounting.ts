import { createClient, fetchExchange, gql } from "urql/core"

const API_URL = `https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3`

const client = createClient({
  exchanges: [fetchExchange],
  url: API_URL,
})

export default async function query(marketId: string) {
  const graphQuery = gql`
    {
      market(id: "${marketId}") {
        dailyMarketAccounting(first: 1000, orderBy: timestamp, orderDirection: asc) {
          timestamp
          accounting {
            totalBaseSupplyUsd
            totalBaseBorrowUsd
            collateralBalanceUsd
          }
        }
      }
    }
  `
  const response = await client.query(graphQuery, {}).toPromise()

  if (response.error) {
    let errorMessage = response.error.toString()
    throw new Error(errorMessage)
  }

  const { market } = response.data

  market.supply = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.accounting.totalBaseSupplyUsd),
  }))

  market.borrow = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.accounting.totalBaseBorrowUsd),
  }))

  market.collateral = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.accounting.collateralBalanceUsd),
  }))

  return market
}
