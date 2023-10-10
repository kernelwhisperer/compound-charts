export type NumberNotation = "standard" | "scientific" | "engineering" | "compact" | undefined

export function formatNumber(
  number: number,
  digits: number,
  notation: NumberNotation = "standard"
) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    notation,
  }).format(number)
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getCrosshairDataPoint(series, param) {
  if (!param.time) {
    return null;
  }
  const dataPoint = param.seriesData.get(series);
  dataPoint.logical = param.logical
  return dataPoint || null;
}

export function formatTime(time) {
  return new Intl.DateTimeFormat(window.navigator.language, {
    dateStyle: "long",
    hourCycle: "h23",
    timeStyle: "short",
  }).format(time)
}
