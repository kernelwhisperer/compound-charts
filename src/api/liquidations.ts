import { gql } from "urql/core"
import { allClients } from "./connections"

export default async function query() {
  const graphQuery = gql`
    {
      absorbCollateralInteractions(first: 1000) {
        id
        market {
          configuration {
            baseToken {
              token {
                symbol
              }
            }
          }
        }
        absorber
        amount
        amountUsd
        asset {
          token {
            symbol
            decimals
          }
          lastPriceUsd 
        }
        transaction {
          hash
          timestamp
        }
      }
    }
  `
  const responses = await Promise.all(
    allClients.map((client) => client.query(graphQuery, {}).toPromise())
  )
  return responses.flatMap((response: any, index) => {
    const data = response.data?.absorbCollateralInteractions || []

    return data.map(x=> {


      return {
        networkIndex: index,
        ...x,
        ...x.transaction,
        ...x.asset,
        amount: x.amount,
        amountUsd: parseFloat(x.amountUsd),
        marketSymbol: x.market.configuration.baseToken.token.symbol,
        assetSymbol: x.asset.token.symbol
      }
    })
  })
}
