'use client'

import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div className="lumera-admin-logo" style={{ padding: '8px 0' }}>
      <Image
        src="/images/logo.png"
        alt="Lumera - Melt Into Luxury"
        width={140}
        height={50}
        style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
        priority
      />
    </div>
  )
}

export default Logo
