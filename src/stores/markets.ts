import { atom, computed, map } from "nanostores"

export const $markets = atom<any[]>([])

export const getMarketById = (networkIndex: number, marketId?: string) =>
  computed($markets, (markets) =>
    marketId && markets
      ? markets.find((x) => x.configuration.id === marketId && x.networkIndex === networkIndex)
      : undefined
  )
