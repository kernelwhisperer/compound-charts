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
        dailyUsage(first: 1000, orderBy: timestamp, orderDirection: asc) {
          timestamp
          day
          usage {
             uniqueUsersCount
             transactionCount
             supplyBaseCount
             withdrawBaseCount
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

  market.txns = market.dailyUsage.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.usage.transactionCount),
  }))

  market.uniqueUsers = market.dailyUsage.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.usage.uniqueUsersCount),
  }))

  market.inflows = market.dailyUsage.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.usage.supplyBaseCount),
  }))

  market.outflows = market.dailyUsage.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.usage.withdrawBaseCount) * -1,
  }))

  return market
}
