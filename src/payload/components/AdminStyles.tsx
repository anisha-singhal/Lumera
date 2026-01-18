"use client"

import React, { useEffect } from 'react'

export const AdminStyles: React.FC = () => {
  useEffect(() => {
    const id = 'lumera-admin-styles'
    if (document.getElementById(id)) return

    const style = document.createElement('style')
    style.id = id
    style.innerHTML = `
      /* Override Payload admin primary button color to Lumera Champagne Gold */
      .payload__button--primary, button[data-payload-button="primary"] {
        background-color: #C9A24D !important;
        border-color: #C9A24D !important;
        color: #1C1C1C !important;
      }

      .payload__button--primary:hover, button[data-payload-button="primary"]:hover {
        filter: brightness(0.95) !important;
      }

      /* Tweak admin header accent for subtle brand presence */
      .payload__header {
        --payloadBrand: #C9A24D; 
      }
    `

    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [])

  return null
}

export default AdminStyles
