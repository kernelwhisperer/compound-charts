import { gql } from "urql/core"
import { allClients } from "./connections"

export default async function query(networkIndex: number, marketId: string, dir = "asc") {
  const graphQuery = gql`
    {
      market(id: "${marketId}") {
        dailyMarketAccounting(first: 1000, orderBy: timestamp, orderDirection: ${dir}) {
          timestamp
          accounting {
            supplyApr
            borrowApr
            rewardSupplyApr
            rewardBorrowApr
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

  market.borrowApr = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseFloat(x.accounting.borrowApr) * 100,
  }))

  market.supplyApr = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseFloat(x.accounting.supplyApr) * 100,
  }))

  market.netBorrowApr = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: (parseFloat(x.accounting.borrowApr) - parseFloat(x.accounting.rewardBorrowApr)) * 100,
  }))

  market.netSupplyApr = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: (parseFloat(x.accounting.supplyApr) + parseFloat(x.accounting.rewardSupplyApr)) * 100,
  }))

  return market
}
