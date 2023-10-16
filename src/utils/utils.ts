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
    return null;
  }
  const dataPoint = param.seriesData.get(series);
  dataPoint.logical = param.logical
  dataPoint.chartId = chartId
  return dataPoint || null;
}

export function formatTime(time) {
  return new Intl.DateTimeFormat(window.navigator.language, {
    dateStyle: "long",
    hourCycle: "h23",
  }).format(time)
}


export function mergeAndReverse(markets, metricName) {
  let merged: any[] = []

  for (let i = 0; i <= 1000; i++) {
    let time
    const marketValues = markets.map((market) => {
      if (i < market[metricName].length) {
        if (!time) {
          time = market[metricName][i].time
        }
        return market[metricName][i].value
      }
      return 0
    })
    const mergedValue = marketValues.reduce((sum, x) => sum + x, 0)

    if (mergedValue !== 0) merged.push({ time, value: mergedValue })
    else break
  }

  return merged.reverse()
}
