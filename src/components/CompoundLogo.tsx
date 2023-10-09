import { Box } from "@mui/material"
import React from "react"
import { $loading } from "../stores/app"
import { useStore } from "@nanostores/react"

export function CompoundLogo() {
  const loading = useStore($loading)

  return (
    <Box sx={{ width: 72, height: 72 }}>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 2000 2000"
        xmlSpace="preserve"
        className={loading ? "loading-indicator-active" : "loading-indicator-inactive"}
      >
        <path
          className="st0"
          d="M1000,2000c552.3,0,1000-447.7,1000-1000S1552.3,0,1000,0S0,447.7,0,1000S447.7,2000,1000,2000z"
        />
        <path
          className="st1"
          d="M577.7,1335.3c-29.9-18.3-48.2-50.8-48.2-85.8v-195.4c0-23.2,18.9-42,42.1-41.9c7.4,0,14.7,2,21.1,5.7
	l440.9,257.1c25.8,15,41.7,42.6,41.7,72.5v202.4c0.1,27.8-22.4,50.4-50.2,50.4c-9.3,0-18.5-2.6-26.4-7.4L577.7,1335.3z
	 M1234.9,964.4c25.8,15,41.6,42.7,41.7,72.5v410.8c0,12.1-6.5,23.3-17.1,29.2l-96.5,54.3c-1.2,0.7-2.5,1.2-3.9,1.6v-228.1
	c0-29.5-15.5-56.9-40.9-72.1L731,1001V743.5c0-23.2,18.9-42,42.1-41.9c7.4,0,14.7,2,21.1,5.7L1234.9,964.4z M1427.9,661
	c25.9,15,41.8,42.7,41.8,72.6v600c-0.1,12.3-6.9,23.6-17.7,29.5l-91.5,49.4V994.8c0-29.5-15.5-56.8-40.7-72L924,685.4V441.2
	c0-7.4,2-14.7,5.6-21.1c11.7-20,37.4-26.8,57.4-15.2L1427.9,661z"
        />
      </svg>
    </Box>
  )
}
