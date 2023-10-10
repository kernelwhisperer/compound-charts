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
        dailyUsage {
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

  return response.data.market
}
