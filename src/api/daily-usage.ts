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

  market.dailyUsage = market.dailyUsage.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.usage.uniqueUsersCount),
  }))

  return market
}
