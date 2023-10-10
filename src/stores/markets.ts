import { atom, map } from "nanostores";

export const $markets = atom<any[]>([])

export const $marketMap = map<Record<string, any>>({})
