import { createClient, fetchExchange, gql } from "urql/core"
import { allClients } from "./connections"

export default async function query(networkIndex: number, marketId: string) {
  const graphQuery = gql`
    {
      market(id: "${marketId}") {
        dailyUsage(first: 1000, orderBy: timestamp, orderDirection: asc) {
          timestamp
          usage {
             uniqueUsersCount
             interactionCount
             supplyBaseCount
             withdrawBaseCount
          }
        }
      }
    }
  `
  const response = await allClients[networkIndex].query(graphQuery, {}).toPromise()

  if (response.error) {
    let errorMessage = response.error.toString()
    throw new Error(errorMessage)
  }

  const { market } = response.data

  market.txns = market.dailyUsage.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.usage.interactionCount),
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
