import { atom, computed, map } from "nanostores"

export const $markets = atom<any[]>([])

export const getMarketById = (marketId?: string) =>
  computed($markets, (markets) => (marketId && markets ? markets.find(x => x.configuration.id === marketId) : undefined))
