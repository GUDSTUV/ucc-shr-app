'use client'

import { Badge } from '@/src/components/atoms/badge'
import { CheckCircle2, ClipboardList, Clock3, FileWarning } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

export type StatCardData = {
  label: string
  value: string
  trend: string
  trendVariant: 'success' | 'red' | 'warning' | 'navy' | 'gray'
  icon: React.ReactNode
  iconClass: string
}

export type AdminStatCardsProps = {
  totalReports: number
  activeCases: number
  resolvedCases: number
  avgResponseHours: number
  trendDiff: number
  trendPercent: number
  resolvedForSlaLength: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export function AdminStatCards({
  totalReports,
  activeCases,
  resolvedCases,
  avgResponseHours,
  trendDiff,
  trendPercent,
  resolvedForSlaLength,
}: AdminStatCardsProps) {
  const statCards: StatCardData[] = [
    {
      label: 'Total Reports',
      value: totalReports.toLocaleString(),
      trend: `${trendDiff >= 0 ? '+' : ''}${trendPercent}%`,
      trendVariant: trendDiff >= 0 ? 'success' : 'red',
      icon: <ClipboardList size={18} />,
      iconClass: 'bg-navy-light text-navy',
    },
    {
      label: 'Active Cases',
      value: activeCases.toLocaleString(),
      trend: `${activeCases} pending`,
      trendVariant: 'warning',
      icon: <FileWarning size={18} />,
      iconClass: 'bg-red-light text-red',
    },
    {
      label: 'Resolved Cases',
      value: resolvedCases.toLocaleString(),
      trend: totalReports > 0 ? `${Math.round((resolvedCases / totalReports) * 100)}% rate` : '0% rate',
      trendVariant: 'success',
      icon: <CheckCircle2 size={18} />,
      iconClass: 'bg-[#E8F5EE] text-[#1A6B50]',
    },
    {
      label: 'Avg. Response Time',
      value: `${avgResponseHours.toFixed(1)} hrs`,
      trend: resolvedForSlaLength ? `${resolvedForSlaLength} closed cases` : 'No closed cases yet',
      trendVariant: 'navy',
      icon: <Clock3 size={18} />,
      iconClass: 'bg-navy-light text-navy',
    },
  ]

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {statCards.map((card) => (
        <motion.article 
          variants={itemVariants}
          key={card.label} 
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md"
        >
          <div className="mb-3 flex items-start justify-between">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconClass}`}>
              {card.icon}
            </span>
            <Badge variant={card.trendVariant}>{card.trend}</Badge>
          </div>

          <p className="text-sm font-medium text-gray-700">{card.label}</p>
          <p className="mt-1 text-[30px] font-semibold leading-none text-gray-900">{card.value}</p>
        </motion.article>
      ))}
    </motion.div>
  )
}
