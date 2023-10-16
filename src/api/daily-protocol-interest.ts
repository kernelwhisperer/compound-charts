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

  protocol.borrowApr = mergeAndReverse(results, "borrowApr")
  protocol.supplyApr = mergeAndReverse(results, "supplyApr")
  protocol.netBorrowApr = mergeAndReverse(results, "netBorrowApr")
  protocol.netSupplyApr = mergeAndReverse(results, "netSupplyApr")

  return protocol
}
