"use client"

import { Box, Paper, useTheme } from "@mui/material"
import { createChart, CrosshairMode, IChartApi } from "lightweight-charts"
import React, { memo, MutableRefObject, useEffect, useRef } from "react"
import { formatNumber } from "../utils/utils"
import { RobotoMonoFF } from "../theme"

// import { $timeframe } from "../stores/metric-page"
// import { createPriceFormatter } from "../utils/chart"
// import { isMobile } from "../utils/client-utils"
// import { RobotoMonoFF } from "./Theme/fonts"

export type ChartProps = {
  significantDigits?: number
  compact?: boolean
  unitLabel?: string
  data: any[]
}

export function Chart(props: ChartProps) {
  const { data, significantDigits = 2, compact = false, unitLabel = "" } = props

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
        },
        mode: CrosshairMode.Normal,
        vertLine: {
          labelBackgroundColor: primaryColor,
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

    chartRef.current.priceScale("right").applyOptions({
      borderVisible: false,
      entireTextOnly: true,
      scaleMargins: {
        bottom: 0,
        top: 0.1,
      },
    })

    window.addEventListener("resize", handleResize)

    const mainSeries = chartRef.current?.addHistogramSeries({
      color: secondaryColor,
      // lineType: 2,
    })

    mainSeries.setData(data)

    chartRef.current.subscribeCrosshairMove((param: any) => {
      let timeFormatted: any = ""
      let priceFormatted = ""
      if (param.time) {
        const data: any = param.seriesData.get(mainSeries)
        const price = data.value !== undefined ? data.value : data.close
        priceFormatted = price.toFixed(significantDigits)
        timeFormatted = new Intl.DateTimeFormat(window.navigator.language, {
          dateStyle: "long",
          hourCycle: "h23",
          timeStyle: "short",
        }).format(param.time * 1000)
        ;(
          legendRef.current as HTMLDivElement
        ).innerHTML = `${timeFormatted} · <strong>${priceFormatted}</strong>`
      } else {
        ;(legendRef.current as HTMLDivElement).innerHTML = ""
      }
    })

    return function cleanup() {
      window.removeEventListener("resize", handleResize)

      chartRef.current?.remove()
    }
  }, [chartRef, theme, containerRef, legendRef])

  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        "& tr:first-of-type td": { cursor: "crosshair" },
        width: "100%",
        height: 400,
        overflow: "hidden",
      }}
      ref={containerRef}
    >
      <div
        ref={legendRef}
        style={{
          background: "var(--mui-palette-background-default)",
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 2,
          fontSize: 13,
          fontFamily: RobotoMonoFF,
        }}
      />
    </Paper>
  )
}
