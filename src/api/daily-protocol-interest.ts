import { createClient, fetchExchange, gql } from "urql/core"
import { allClients } from "./connections"
import queryDailyInterest from "./daily-interest"
import { mergeAndReverse } from "../utils/utils"

export default async function query(markets: any) {
  if (!markets.length) return

  const results = await Promise.all(
    markets.map((market) =>
      queryDailyInterest(market.networkIndex, market.configuration.id, "desc")
    )
  )

  const protocol: any = {}

  protocol.borrowApr = mergeAndReverse(results, "borrowApr", true)
  protocol.supplyApr = mergeAndReverse(results, "supplyApr", true)
  protocol.netBorrowApr = mergeAndReverse(results, "netBorrowApr", true)
  protocol.netSupplyApr = mergeAndReverse(results, "netSupplyApr", true)

  return protocol
}
