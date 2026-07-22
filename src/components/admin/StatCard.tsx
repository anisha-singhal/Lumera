import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-[#E7DED4] p-6 shadow-[0_2px_16px_rgba(128,0,32,0.04)] hover:shadow-[0_8px_30px_rgba(128,0,32,0.10)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#800020] to-[#C9A24D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9d8d7f]">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-[#1C1C1C] tabular-nums">{value}</p>
          {subtitle && (
            <p className="mt-1.5 text-sm text-[#6E6E6E]">{subtitle}</p>
          )}
          {trend && (
            <p className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-[#800020] to-[#5c0017] flex items-center justify-center shadow-inner">
          <Icon className="w-6 h-6 text-[#C9A24D]" />
        </div>
      </div>
    </div>
  )
}
