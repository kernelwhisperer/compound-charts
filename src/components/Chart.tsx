"use client"

import { Box, Paper, useTheme } from "@mui/material"
import { createChart, CrosshairMode, IChartApi } from "lightweight-charts"
import React, { memo, MutableRefObject, useEffect, useRef } from "react"
import { formatNumber, formatTime, getCrosshairDataPoint } from "../utils/utils"
import { RobotoMonoFF } from "../theme"
import { $dataPoint, $timeRange } from "../stores/app"

// import { $timeframe } from "../stores/metric-page"
// import { createPriceFormatter } from "../utils/chart"
// import { isMobile } from "../utils/client-utils"
// import { RobotoMonoFF } from "./Theme/fonts"

export type ChartProps = {
  significantDigits?: number
  compact?: boolean
  unitLabel?: string
  data: any[]
  secondData?: any[]
  diffMode?: boolean
  dataLabel?: string
  secondDataLabel?: string
  areaSeries?: boolean
  minValueZero?: boolean
  chartOpts?: any
}

export function Chart(props: ChartProps) {
  const {
    data,
    secondData,
    significantDigits = 2,
    diffMode = false,
    compact = false,
    unitLabel = "",
    dataLabel = "",
    secondDataLabel = "",
    areaSeries = false,
    minValueZero = false,
    chartOpts = {},
  } = props

  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi>()
  const legendRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const handleResize = () => {
      chartRef.current?.applyOptions({
        height: containerRef.current?.clientHeight,
        width: containerRef.current?.clientWidth,
      })
    }
    const primaryColor = theme.palette.primary.main
    const secondaryColor = theme.palette.secondary.main
    const textColor = theme.palette.text.primary
    const borderColor = theme.palette.divider

    chartRef.current = createChart(containerRef.current, {
      crosshair: {
        horzLine: {
          labelBackgroundColor: primaryColor,
          color: areaSeries ? "#ffffff80" : "#fff",
          // style: 4,
        },
        mode: CrosshairMode.Normal,
        vertLine: {
          labelBackgroundColor: primaryColor,
          color: areaSeries ? "#ffffff80" : "#fff",
          // style: 4
        },
      },
      grid: {
        horzLines: {
          color: borderColor,
        },
        vertLines: {
          color: borderColor,
        },
      },
      // handleScroll: {
      //   mouseWheel: false,
      // },
      layout: {
        background: { color: "transparent" },
        // fontFamily: RobotoMonoFF,
        textColor,
      },
      localization: {
        priceFormatter: (x: number) =>
          `${formatNumber(x, significantDigits, compact ? "compact" : undefined)} ${unitLabel}`,
      },
      width: containerRef.current.clientWidth,
    })

    chartRef.current.timeScale().applyOptions({
      borderVisible: false,
      // rightOffset: 4,
    })
    chartRef.current.timeScale().fitContent()

    chartRef.current.priceScale("right").applyOptions({
      borderVisible: false,
      entireTextOnly: true,
      scaleMargins: {
        bottom: 0,
        top: 0.1,
      },
      autoScale: true,
    })

    window.addEventListener("resize", handleResize)

    const mainSeries = areaSeries
      ? chartRef.current?.addAreaSeries({
          priceLineVisible: false,
          lineColor: "rgba(0, 211, 149, 0.8)",
          topColor: "rgba(0, 211, 149, 0.33)",
          bottomColor: "rgba(0, 211, 149, 0)",
          lineType: 1,
          lineWidth: 2,
          autoscaleInfoProvider: minValueZero
            ? (original) => {
                const res = original()
                if (res !== null) {
                  res.priceRange.minValue = Math.min(0, res.priceRange.minValue)
                  // res.priceRange.maxValue += 2
                }
                return res
              }
            : undefined,
          ...chartOpts,
        })
      : chartRef.current?.addHistogramSeries({
          color: "rgba(0, 211, 149, 1)",
          priceLineVisible: false,
        })

    mainSeries.setData(data)

    let secondSeries

    if (secondData) {
      secondSeries = areaSeries
        ? chartRef.current?.addAreaSeries({
            priceLineVisible: false,
            lineColor: "rgba(143, 102, 255, 0.8)",
            topColor: "rgba(143, 102, 255, 0.33)",
            bottomColor: "rgba(143, 102, 255, 0)",
            lineType: 1,
            lineWidth: 2,
            ...chartOpts,
          })
        : chartRef.current?.addHistogramSeries({
            color: "rgba(143, 102, 255, 1)",
            priceLineVisible: false,
          })

      secondSeries.setData(secondData)
    }

    const chartId = Math.random()

    const unsub1 = $dataPoint.subscribe((dataPoint: any) => {
      if (dataPoint?.chartId === chartId) return
      if (dataPoint) {
        let { value } = mainSeries.dataByIndex(dataPoint.logical) as any
        let style = ""

        if (secondData && diffMode) {
          const { value: secondValue } = secondSeries.dataByIndex(dataPoint.logical) as any
          value += secondValue
          if (value === 0) style = '"color: #fff;"'
          if (value < 0) style = '"color: rgba(143, 102, 255, 1);"'
        }

        let label = `${formatTime(
          (dataPoint.time as number) * 1000
        )} · ${dataLabel} <strong style=${style}>${formatNumber(
          value,
          significantDigits,
          compact ? "compact" : undefined
        )} ${unitLabel}</strong>`

        if (secondData && !diffMode) {
          const { value: secondValue } = secondSeries.dataByIndex(dataPoint.logical) as any
          label += ` · ${secondDataLabel} <strong style="color: rgba(143, 102, 255, 1);">${formatNumber(
            secondValue,
            significantDigits,
            compact ? "compact" : undefined
          )} ${unitLabel}</strong>`
        }

        if (legendRef.current) legendRef.current.innerHTML = label

        if (dataPoint) {
          chartRef.current?.setCrosshairPosition(undefined as any, dataPoint.time, mainSeries)
        }
      } else {
        if (legendRef.current) legendRef.current.innerHTML = ""
        chartRef.current?.clearCrosshairPosition()
      }
    })

    chartRef.current.subscribeCrosshairMove((param) => {
      $dataPoint.set(getCrosshairDataPoint(mainSeries, param, chartId))

      if (param.time) {
        let { value } = param.seriesData.get(mainSeries) as any
        let style = ""

        if (secondData && diffMode) {
          const { value: secondValue } = param.seriesData.get(secondSeries) as any
          value += secondValue
          if (value === 0) style = '"color: #fff;"'
          if (value < 0) style = '"color: rgba(143, 102, 255, 1);"'
        }

        let label = `${formatTime(
          (param.time as number) * 1000
        )} · ${dataLabel} <strong style=${style}>${formatNumber(
          value,
          significantDigits,
          compact ? "compact" : undefined
        )} ${unitLabel}</strong>`

        if (secondData && !diffMode) {
          const { value: secondValue } = param.seriesData.get(secondSeries) as any
          label += ` · ${secondDataLabel} <strong style="color: rgba(143, 102, 255, 1);">${formatNumber(
            secondValue,
            significantDigits,
            compact ? "compact" : undefined
          )} ${unitLabel}</strong>`
        }

        if (legendRef.current) legendRef.current.innerHTML = label
      } else {
        if (legendRef.current) legendRef.current.innerHTML = ""
      }
    })

    chartRef.current.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
      if (!timeRange) return

      const current = $timeRange.get()
      if (current && timeRange.from === current.from && timeRange.to && current.to) return

      $timeRange.set({ chartId, timeRange })
    })

    const unsub2 = $timeRange.subscribe((newValue: any) => {
      if (!newValue || newValue.chartId === chartId) return
      chartRef.current?.timeScale().setVisibleLogicalRange(newValue.timeRange)
    })

    return function cleanup() {
      window.removeEventListener("resize", handleResize)
      unsub1()
      unsub2()

      chartRef.current?.remove()
    }
  }, [chartRef, theme, containerRef, legendRef])

  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        "& tr:first-of-type td": { cursor: "none" },
        width: "100%",
        height: 400,
        overflow: "hidden",
      }}
      ref={containerRef}
    >
      <Box
        ref={legendRef}
        sx={{
          paddingLeft: 1,
          paddingRight: 1,
          background: "var(--mui-palette-background-default)",
          position: "absolute",
          top: 8,
          zIndex: 2,
          fontSize: 13,
          fontFamily: RobotoMonoFF,
          "&> strong": {
            color: theme.palette.secondary.main,
          },
        }}
      />
    </Paper>
  )
}
