import { atom } from "nanostores"

export const $loading = atom<boolean>(false)

export const $dataPoint = atom()
export const $timeRange = atom<any>()
