import { Stack, StackProps } from "@mui/material"
import { animated, AnimationConfig, config, useTrail } from "@react-spring/web"
import React, { Children } from "react"

const SHOW_STATE = { opacity: 1, y: 0, clipPath: "inset(-10% -10% -10% -10%)" }; // Fully shown
const HIDE_STATE = { opacity: 0, y: 30, clipPath: "inset(0% 0% 100% 0%)" }; // Fully hidden (from top to bottom)

export function AnimatedList({ children, show = true, ...rest }: any) {
  const items = Children.toArray(children)

  const trails = useTrail(items.length, {
    config: { friction: 200, mass: 5, tension: 2000 },
    from: HIDE_STATE,
    reverse: !show,
    to: show ? SHOW_STATE : HIDE_STATE,
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
