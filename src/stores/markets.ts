import { atom, computed, map } from "nanostores"

export const $markets = atom<any[]>([])

export const $marketMap = map<Record<string, any>>({})

export const getMarketById = (marketId?: string) =>
  computed($marketMap, (marketMap) => (marketId && marketMap ? marketMap[marketId] : undefined))
