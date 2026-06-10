'use client'

import { Badge } from '@/src/components/atoms/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export type TrendBarData = {
  key: string
  label: string
  count: number
  height?: number // keeping this for backwards compatibility, though recharts handles height
}

export type MonthlyTrendsChartProps = {
  trendBars: TrendBarData[]
}

export function MonthlyTrendsChart({ trendBars }: MonthlyTrendsChartProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Monthly Reporting Trends</h2>
        <Badge variant="gray">Last 6 Months</Badge>
      </div>

      <div className="h-64 w-full" role="img" aria-label="Monthly report volume for the last six months">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendBars} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
            />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              fill="#1e3a8a" 
              radius={[4, 4, 0, 0]} 
              name="Reports"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
