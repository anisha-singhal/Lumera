import { Header, Footer } from '@/components/layout'
import Link from 'next/link'

export const metadata = {
  title: 'Cancellation Policy | Lumera',
  description: 'Learn about Lumera\'s cancellation policy.',
}

export default function CancellationPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-burgundy-700 mb-4">Cancellation Policy</h1>
              <div className="line-accent mx-auto" />
            </div>

            <div className="prose prose-burgundy max-w-none space-y-8 text-burgundy-700/80 font-sans">
              <p>Orders can be cancelled within 12 hours of placing the order.</p>
              <p>
                To request a cancellation, please contact our customer care at{' '}
                <a href="mailto:lumeracandlesinfo@gmail.com" className="text-burgundy-700 underline">
                  lumeracandlesinfo@gmail.com
                </a>
                .
              </p>
            </div>

            <div className="mt-12 text-center">
              <Link href="/" className="btn-ghost">
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
