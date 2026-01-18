import { Header, Footer } from '@/components/layout'
import Link from 'next/link'
import { Eye, Baby, Scissors, Clock, Flame, Wind, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Candle Care & Safety | Lumera',
  description: 'Guidelines to safely enjoy your Lumera candles.',
}

const safetyGuidelines = [
  {
    icon: Eye,
    title: 'Never Leave Unattended',
    description: 'Burn the candle within sight and never leave it unattended.',
  },
  {
    icon: Baby,
    title: 'Keep Away from Children & Pets',
    description: 'Keep away from children and pets at all times.',
  },
  {
    icon: Scissors,
    title: 'Trim the Wick',
    description: 'Trim the wick to 5 mm before every burn for a clean, even flame.',
  },
  {
    icon: Clock,
    title: 'Burn Time Limit',
    description: 'Do not burn for more than 3 hours at a time.',
  },
  {
    icon: Flame,
    title: 'Stable Surface',
    description: 'Place on a stable, heat-resistant surface, away from drafts and flammable items.',
  },
  {
    icon: Wind,
    title: 'Well-Ventilated Space',
    description: 'Burn in a well-ventilated space. All fragrances are IFRA-compliant.',
  },
  {
    icon: AlertTriangle,
    title: 'Discontinue Use',
    description: 'Discontinue use when ½ inch of wax remains.',
  },
]

export default function CandleCarePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-spacing">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="font-serif text-burgundy-700 mb-4">Candle Care & Safety</h1>
              <div className="line-accent mx-auto mb-6" />
              <p className="text-burgundy-700/70 font-sans">
                Follow these guidelines to safely enjoy your Lumera candles and maximize their burn time.
              </p>
            </div>

            <div className="space-y-6">
              {safetyGuidelines.map((guideline, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 bg-cream-200/50 border border-burgundy-700/10 hover:border-[#C9A24D]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-burgundy-700/5 flex items-center justify-center flex-shrink-0">
                    <guideline.icon className="w-5 h-5 text-[#C9A24D]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-burgundy-700 mb-1">
                      {guideline.title}
                    </h3>
                    <p className="text-sm font-sans text-burgundy-700/70 leading-relaxed">
                      {guideline.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Tips */}
            <div className="mt-12 p-6 bg-burgundy-700 text-cream-100">
              <h2 className="font-serif text-xl mb-4 text-[#C9A24D]">Pro Tips for Best Experience</h2>
              <ul className="space-y-3 text-sm font-sans text-cream-100/90">
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A24D]">•</span>
                  For the first burn, let the wax melt to the edges of the container to prevent tunneling.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A24D]">•</span>
                  Store your candles in a cool, dry place away from direct sunlight.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A24D]">•</span>
                  Use a candle snuffer to extinguish the flame to prevent wax splatter.
                </li>
              </ul>
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
