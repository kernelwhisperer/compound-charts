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

  return responses.flatMap((response: any) => response.data?.markets)
}
