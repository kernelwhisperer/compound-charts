import { Stack, StackProps } from "@mui/material"
import { animated, AnimationConfig, config, useTrail } from "@react-spring/web"
import React, { Children } from "react"

const SHOW_STATE = {
  // pointerEvents: "unset",
  // overflow: "unset",
  opacity: 1,
  x: 0,
  clipPath: "inset(-10% -10% -10% -10%)",
} // Fully shown
const HIDE_STATE = {
  // pointerEvents: "none",
  // overflow: "hidden",
  opacity: 0,
  x: -30,
  clipPath: "inset(0% 0% 100% 0%)",
}
const INIT_STATE = {
  // pointerEvents: "none",
  // overflow: "hidden",
  opacity: 0,
  x: 30,
  clipPath: "inset(0% 0% 100% 0%)",
}

export function AnimatedList({ children, show = true, ...rest }: any) {
  const items = Children.toArray(children)

  const trails = useTrail(items.length, {
    config: show
      ? { friction: 120, mass: 5, tension: 2000 }
      : { friction: 120, mass: 5, tension: 2000 },
    from: show ? INIT_STATE : HIDE_STATE,
    reverse: !show,
    to: SHOW_STATE,
  })

  return (
    <Stack {...rest}>
      {trails.map((props, index) => (
        <animated.div key={index} style={props}>
          {items[index]}
        </animated.div>
      ))}
    </Stack>
  )
}
