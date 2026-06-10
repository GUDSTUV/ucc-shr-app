'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const MonthlyTrendsChart = dynamic(
  () => import('@/src/components/organisms/monthly-trends-chart').then((mod) => mod.MonthlyTrendsChart),
  {
    ssr: false,
    loading: () => <div className="h-[340px] w-full animate-pulse rounded-2xl bg-gray-50 xl:col-span-2" />
  }
)

type TrendBar = {
  key: string
  label: string
  count: number
  height: number
}

type Props = {
  trendBars: TrendBar[]
}

export default function MonthlyTrendsChartClient({ trendBars }: Props) {
  return <MonthlyTrendsChart trendBars={trendBars} />
}
