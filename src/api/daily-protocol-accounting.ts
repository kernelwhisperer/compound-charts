import { createClient, fetchExchange, gql } from "urql/core"
import { allClients } from "./connections"

export async function queryDailyAccounting(networkIndex: number, marketId: string) {
  const graphQuery = gql`
    {
      market(id: "${marketId}") {
        dailyMarketAccounting(first: 1000, orderBy: timestamp, orderDirection: desc) {
          timestamp
          accounting {
            totalBaseSupplyUsd
            totalBaseBorrowUsd
            collateralBalanceUsd
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

  market.tvl = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value: parseInt(x.accounting.totalBaseSupplyUsd) + parseInt(x.accounting.collateralBalanceUsd),
  }))

  market.tvlExclBorrows = market.dailyMarketAccounting.map((x: any) => ({
    time: parseInt(x.timestamp),
    value:
      parseInt(x.accounting.totalBaseSupplyUsd) -
      parseInt(x.accounting.totalBaseBorrowUsd) +
      parseInt(x.accounting.collateralBalanceUsd),
  }))

  // market.borrow = market.dailyMarketAccounting.map((x: any) => ({
  //   time: parseInt(x.timestamp),
  //   value: parseInt(x.accounting.totalBaseBorrowUsd),
  // }))

  // market.collateral = market.dailyMarketAccounting.map((x: any) => ({
  //   time: parseInt(x.timestamp),
  //   value: parseInt(x.accounting.collateralBalanceUsd),
  // }))

  // market.borrowApr = market.dailyMarketAccounting.map((x: any) => ({
  //   time: parseInt(x.timestamp),
  //   value: parseFloat(x.accounting.borrowApr) * 100,
  // }))

  // market.supplyApr = market.dailyMarketAccounting.map((x: any) => ({
  //   time: parseInt(x.timestamp),
  //   value: parseFloat(x.accounting.supplyApr) * 100,
  // }))

  // market.netBorrowApr = market.dailyMarketAccounting.map((x: any) => ({
  //   time: parseInt(x.timestamp),
  //   value: (parseFloat(x.accounting.borrowApr) - parseFloat(x.accounting.rewardBorrowApr)) * 100,
  // }))

  // market.netSupplyApr = market.dailyMarketAccounting.map((x: any) => ({
  //   time: parseInt(x.timestamp),
  //   value: (parseFloat(x.accounting.supplyApr) + parseFloat(x.accounting.rewardSupplyApr)) * 100,
  // }))

  return market
}

export default async function query(markets: any[]) {
  const results = await Promise.all(
    markets.map((market) => queryDailyAccounting(market.networkIndex, market.configuration.id))
  )

  let tvl: any[] = []

  for (let i = 0; i <= 1000; i++) {
    let time
    const marketTvl = results.map((marketStats) => {
      if (i < marketStats.tvl.length) {
        if (!time) {
          time = marketStats.tvl[i].time
        }
        return marketStats.tvl[i].value
      }
      return 0
    })
    const accTvl = marketTvl.reduce((sum, x) => sum + x, 0)

    if (accTvl !== 0) tvl.push({ time, value: accTvl })
    else break
  }

  const tvlExclBorrows: any[] = []

  for (let i = 0; i <= 1000; i++) {
    let time
    const marketTvl = results.map((marketStats) => {
      if (i < marketStats.tvlExclBorrows.length) {
        if (!time) {
          time = marketStats.tvlExclBorrows[i].time
        }
        return marketStats.tvlExclBorrows[i].value
      }
      return 0
    })
    const accTvl = marketTvl.reduce((sum, x) => sum + x, 0)

    if (accTvl !== 0) tvlExclBorrows.push({ time, value: accTvl })
    else break
  }

  return { tvl: tvl.reverse(), tvlExclBorrows: tvlExclBorrows.reverse() }
}
