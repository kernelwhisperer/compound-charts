export type NumberNotation = "standard" | "scientific" | "engineering" | "compact" | undefined

export const TZ_OFFSET = new Date().getTimezoneOffset() * 60 * 1000

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

export function formatUsdc(
  number: number,
  digits: number,
  notation: NumberNotation = "standard"
) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
    maximumSignificantDigits: 2,
    notation,
  }).format(number)
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getCrosshairDataPoint(series, param, chartId) {
  if (!param.time) {
    return null
  }
  const dataPoint = param.seriesData.get(series)
  dataPoint.logical = param.logical
  dataPoint.chartId = chartId
  return dataPoint || null
}

export function formatTime(time) {
  return new Intl.DateTimeFormat(window.navigator.language, {
    dateStyle: "long",
    hourCycle: "h23",
  }).format(time)
}

export function formatTimeWithHour(time) {
  return new Intl.DateTimeFormat(window.navigator.language, {
    dateStyle: "medium",
    hourCycle: "h23",
    timeStyle: "short"
  }).format(time)
}

export function mergeAndReverse(markets, metricName, avg = false) {
  let merged: any[] = []

  for (let i = 0; i <= 1000; i++) {
    let time
    let marketValues = markets.map((market) => {
      if (i < market[metricName].length) {
        if (!time) {
          time = market[metricName][i].time
        }
        return market[metricName][i].value
      }
      return undefined
    })

    let mergedValue
    if (avg) {
      // Median calculation
      marketValues = marketValues.filter((x) => x !== undefined).sort((a, b) => a - b)
      const n = marketValues.length
      if (n % 2 === 0) {
        mergedValue = (marketValues[n / 2 - 1] + marketValues[n / 2]) / 2
      } else {
        mergedValue = marketValues[Math.floor(n / 2)]
      }
    } else {
      mergedValue = marketValues.reduce((sum, x) => (x ? sum + x : sum), 0)
    }

    if (time) merged.push({ time, value: mergedValue })
    else break
  }

  return merged.reverse()
}

export function formatHex(addr: string) {
  return `${addr.slice(0, 5)}...${addr.slice(-3)}`
}

export function getExplorerLink(networkIndex: number, addr: string, type: string) {
  if (networkIndex === 0) return `https://etherscan.io/${type}/${addr}`
  if (networkIndex === 1) return `https://arbiscan.io/${type}/${addr}`
  if (networkIndex === 2) return `https://polygonscan.com/${type}/${addr}`
  if (networkIndex === 3) return `https://basescan.org/${type}/${addr}`
  
  return ""
}
