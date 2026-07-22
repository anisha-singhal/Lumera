import type { ReactNode } from 'react'
import Providers from '@/components/Providers'
import WhatsAppButton from '../components/WhatsAppButton'
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
        <WhatsAppButton />
      </Providers>
    </div>
  )
}

