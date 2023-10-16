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
