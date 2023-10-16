import React from "react"
import { PieChart, Pie, Cell } from "recharts"

export function RadialPercentage({ percentage }: any) {
  return (
    <>
      <PieChart width={24} height={24} style={{ display: "inline-block", bottom: -3 }}>
        <Pie
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          data={[
            { name: "Percentage", value: percentage * 100 },
            { name: "Remaining", value: 100 - percentage * 100 },
          ]}
          cx={5}
          cy={10}
          innerRadius={4}
          outerRadius={8}
          fill="rgba(138, 141, 149, 0.8)"
          labelLine={false}
          stroke="rgba(38, 41, 49, 1)"
          rootTabIndex={-1}
          animationDuration={300}
          animationEasing="ease-in-out"
          animationBegin={200}
        >
          <Cell key="Percentage" fill="rgb(0, 211, 149)" />
        </Pie>
      </PieChart>
    </>
  )
}
