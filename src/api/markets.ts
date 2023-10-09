import { createClient, fetchExchange, gql } from "urql/core"

const API_URL = `https://api.thegraph.com/subgraphs/name/papercliplabs/compound-v3`

const client = createClient({
  exchanges: [fetchExchange],
  url: API_URL,
})

export default async function query() {
  const graphQuery = gql`
    {
      markets {
        configuration {
          name
          symbol
          baseToken {
            id
            token {
              name
              symbol
              id
            }
          }
        }
        creationBlockNumber
      }
    }
  `
  const response = await client.query(graphQuery, {}).toPromise()

  if (response.error) {
    let errorMessage = response.error.toString()
    throw new Error(errorMessage)
  }

  return response.data.markets
}
