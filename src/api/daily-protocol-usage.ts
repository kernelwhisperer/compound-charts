import { createClient, fetchExchange, gql } from "urql/core"
import { allClients } from "./connections"
import queryDailyUsage from "./daily-usage"
import { mergeAndReverse } from "../utils/utils"

export default async function query(markets: any) {
  if(!markets.length) return

  const results = await Promise.all(
    markets.map((market) => queryDailyUsage(market.networkIndex, market.configuration.id, "desc"))
  )

  const protocol: any = {}

  protocol.txns = mergeAndReverse(results, "txns")
  protocol.uniqueUsers = mergeAndReverse(results, "uniqueUsers")
  protocol.inflows = mergeAndReverse(results, "inflows")
  protocol.outflows = mergeAndReverse(results, "outflows")
  protocol.liquidations = mergeAndReverse(results, "liquidations")

  return protocol
}
