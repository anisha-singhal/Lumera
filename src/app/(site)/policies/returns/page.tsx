import { Header, Footer } from '@/components/layout'
import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'

export const metadata = {
  title: 'Return and Exchange Policy | Lumera',
  description: 'Learn about Lumera\'s return and exchange policies for candle products.',
}

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-burgundy-700 mb-4">Return & Exchange Policy</h1>
              <div className="line-accent mx-auto" />
            </div>

            <div className="prose prose-burgundy max-w-none space-y-10 text-burgundy-700/80 font-sans">

              {/* No Returns Section */}
              <section className="bg-cream-200/50 p-6 border-l-4 border-[#C9A24D]">
                <h2 className="font-serif text-2xl text-burgundy-700 mb-4">No Returns or Exchanges</h2>
                <p className="leading-relaxed">
                  Due to the personal and fragrance-based nature of our candles, Lumera does not accept
                  returns or exchanges once an order has been delivered. All custom or personalized
                  candles are strictly non-returnable and non-refundable. Customers are advised to
                  carefully review product details, fragrance notes, and customization information
                  before placing an order.
                </p>
              </section>

              {/* Transit Damage Section */}
              <section>
                <h2 className="font-serif text-2xl text-burgundy-700 mb-4">Transit Damage or Defective Products</h2>
                <p className="leading-relaxed mb-4">
                  If your order arrives damaged during transit or has a manufacturing defect, please
                  contact us within <strong className="text-burgundy-700">24 hours</strong> of delivery with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clear images or videos of the outer packaging</li>
                  <li>Clear images or videos of the inner packaging</li>
                  <li>Clear images or videos of the affected product</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Upon successful verification, a replacement of the same product will be provided,
                  subject to availability. <strong className="text-burgundy-700">Refunds are not applicable in such cases.</strong>
                </p>
              </section>

              {/* Order Modifications Section */}
              <section>
                <h2 className="font-serif text-2xl text-burgundy-700 mb-4">Order Modifications & Limited Refunds</h2>
                <p className="leading-relaxed mb-4">
                  Requests for address changes, customization changes, or order cancellations may be
                  considered <strong className="text-burgundy-700">only if the order has not yet been processed or dispatched</strong>.
                  Customers must contact us immediately and receive confirmation from our team.
                </p>
                <p className="leading-relaxed">
                  Refunds are issued only in cases of:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Failed payments</li>
                  <li>Product becomes unavailable after order confirmation</li>
                </ul>
              </section>

              {/* Contact Section */}
              <section className="bg-burgundy-700/5 p-6 rounded-lg">
                <h2 className="font-serif text-2xl text-burgundy-700 mb-4">Contact Us</h2>
                <div className="space-y-3">
                  <a
                    href="mailto:lumeracandlesinfo@gmail.com"
                    className="flex items-center gap-3 text-burgundy-700 hover:text-burgundy-600 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-[#C9A24D]" />
                    lumeracandlesinfo@gmail.com
                  </a>
                  <a
                    href="tel:+919625205260"
                    className="flex items-center gap-3 text-burgundy-700 hover:text-burgundy-600 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-[#C9A24D]" />
                    +91 9625205260
                  </a>
                </div>
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
