import { createClient, fetchExchange, gql } from "urql/core"
import { allClients } from "./connections"
import queryDailyAccounting from "./daily-accounting"
import { mergeAndReverse } from "../utils/utils"

export default async function query(markets: any) {
  if(!markets.length) return

  const results = await Promise.all(
    markets.map((market) => queryDailyAccounting(market.networkIndex, market.configuration.id, "desc"))
  )

  const protocol: any = {}

  protocol.supply = mergeAndReverse(results, "supply")
  protocol.borrow = mergeAndReverse(results, "borrow")
  protocol.collateral = mergeAndReverse(results, "collateral")

  return protocol
}
