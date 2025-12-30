import { Header, Footer } from '@/components/layout'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Lumera',
  description: 'Learn about how Lumera collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-burgundy-700 mb-4">Privacy Policy</h1>
              <div className="line-accent mx-auto" />
              <p className="mt-4 text-sm text-burgundy-700/60">
                Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="prose prose-burgundy max-w-none space-y-8 text-burgundy-700/80 font-sans">
              <section>
                <p>
                  We respect your privacy. Your information is used solely to process orders and
                  enhance your experience with Lumera.
                </p>
              </section>
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
