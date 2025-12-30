'use client'

import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div className="lumera-icon">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Candle flame */}
        <path
          d="M12 2C12 2 8 8 8 14C8 18 10 22 12 22C14 22 16 18 16 14C16 8 12 2 12 2Z"
          fill="#D4AF37"
          opacity="0.8"
        />
        <path
          d="M12 6C12 6 10 10 10 14C10 16.5 11 19 12 19C13 19 14 16.5 14 14C14 10 12 6 12 6Z"
          fill="#800020"
        />
      </svg>
    </div>
  )
}

export default Icon

