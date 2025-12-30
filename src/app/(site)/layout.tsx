import type { ReactNode } from 'react'
import Providers from '@/components/Providers'
import '../globals.css'

export default function SiteLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="lumera-site">
      <Providers>
        {children}
      </Providers>
    </div>
  )
}

