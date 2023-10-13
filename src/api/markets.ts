import { gql } from "urql/core"
import { allClients } from "./connections"

export default async function query() {
  const graphQuery = gql`
    {
      markets {
        configuration {
          id
          name
          symbol
          baseToken {
            id
            token {
              name
              symbol
              id
              decimals
            }
          }
        }
        creationBlockNumber
        accounting {
          collateralBalanceUsd
          totalBaseBorrow
          totalBaseBorrowUsd
          totalBaseSupply
          totalBaseSupplyUsd
          utilization
        }
      }
    }
  `
  const responses = await Promise.all(
    allClients.map((client) => client.query(graphQuery, {}).toPromise())
  )

  return responses
    .flatMap((response: any, index) => {
      const marketData = response.data?.markets || []

      return marketData.map((x) => {
        x.networkIndex = index
        x.configuration.baseToken.token.symbol = x.configuration.baseToken.token.symbol.replace(
          "USDbC",
          "USDC"
        )
        x.configuration.baseToken.token.name = x.configuration.baseToken.token.name
          .replace("Base ", "")
          .replace("(Arb1)", "")
          .replace("(PoS)", "")
          .replace("Wrapped ", "")
        return x
      })
    })
    .sort(
      (a, b) =>
        // a.configuration.baseToken.token.name.localeCompare(b.configuration.baseToken.token.name)
        b.accounting.totalBaseSupplyUsd - a.accounting.totalBaseSupplyUsd
    )
}
