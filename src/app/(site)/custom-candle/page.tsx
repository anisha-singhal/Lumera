import { Header, Footer } from '@/components/layout'
import CustomCandleBuilder from '@/components/CustomCandleBuilder'

export default function CustomCandlePage() {
  return (
    <>
      <Header />
      <main>
        <CustomCandleBuilder />
      </main>
      <Footer />
    </>
  )
}
