'use client'

import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
      <svg
        width="140"
        height="40"
        viewBox="0 0 140 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Candle flame icon */}
        <g>
          <path
            d="M20 8C20 8 16 14 16 20C16 24 18 28 20 28C22 28 24 24 24 20C24 14 20 8 20 8Z"
            fill="#D4AF37"
            opacity="0.8"
          />
          <path
            d="M20 12C20 12 18 16 18 20C18 22.5 19 25 20 25C21 25 22 22.5 22 20C22 16 20 12 20 12Z"
            fill="#5A0A0A"
          />
        </g>
        {/* LUMERA text */}
        <text
          x="35"
          y="26"
          fontFamily="Georgia, serif"
          fontSize="20"
          fontWeight="500"
          fill="#6e1629"
          letterSpacing="0.15em"
        >
          LUMERA
        </text>
      </svg>
    </div>
  )
}

export default Logo
