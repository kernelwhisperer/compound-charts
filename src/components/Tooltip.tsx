import { Fade } from "@mui/material"
import { styled } from "@mui/material/styles"
import MuiTooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip"
import * as React from "react"

export const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip
    TransitionComponent={Fade}
    classes={{ popper: className }}
    arrow
    // enterDelay={800}
    disableInteractive
    {...props}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    borderRadius: 0,
    background: "var(--mui-palette-primary-main)",
    color: "var(--mui-palette-background-default)",
    fontSize: theme.typography.body2.fontSize,
    maxWidth: 380,
    padding: 16,
  },
}))
