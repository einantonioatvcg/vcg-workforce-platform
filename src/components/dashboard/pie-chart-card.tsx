'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface DoughnutChartCardProps {
  title: string
  description: string
  data: { name: string; value: number }[]
  colors?: string[]
  maxSlices?: number
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#0ea5e9']

const truncateText = (text: string, maxLen: number) => {
  if (text.length <= maxLen) return text;
  return text.substr(0, maxLen) + '...';
}

export function DoughnutChartCard({ title, description, data, colors = DEFAULT_COLORS, maxSlices = 6 }: DoughnutChartCardProps) {
  // Limpiamos los top N y agrupamos el resto en "Otros" si son demasiados, para mantener el pastel limpio
  let displayData = [...data]
  const rawTotalValue = displayData.reduce((acc, curr) => acc + curr.value, 0)

  if (displayData.length > maxSlices) {
    const topData = displayData.slice(0, maxSlices - 1)
    const othersValue = displayData.slice(maxSlices - 1).reduce((acc, curr) => acc + curr.value, 0)
    topData.push({ name: 'Otros', value: othersValue })
    displayData = topData
  }

  // Prevenimos mapear datos nulos de DB
  displayData = displayData.filter(item => item.name && item.value > 0)

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm flex flex-col pt-4">
      <div className="px-6 pb-2">
        <h3 className="font-semibold tracking-tight text-base sm:text-lg">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <div className="flex-1 px-4 flex flex-col justify-start">
        {displayData.length > 0 ? (
          <>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    stroke="none"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {displayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat('es-MX').format(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend as Data Table */}
            <div className="mt-2 w-full max-h-48 overflow-y-auto mb-4 border border-zinc-100 dark:border-zinc-800 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500">
                  <tr>
                    <th className="font-semibold px-3 py-2">Categoría</th>
                    <th className="font-semibold px-3 py-2 text-right">Volumen</th>
                    <th className="font-semibold px-3 py-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {displayData.map((item, i) => {
                    const pct = rawTotalValue > 0 ? (item.value / rawTotalValue) * 100 : 0
                    return (
                      <tr key={item.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        <td className="px-3 py-2 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                          <span className="truncate max-w-[180px] sm:max-w-[220px] font-medium text-zinc-700 dark:text-zinc-300" title={item.name}>{item.name}</span>
                        </td>
                        <td className="px-3 py-2 text-right text-zinc-600 dark:text-zinc-400 font-medium">
                          {new Intl.NumberFormat('es-MX', { notation: 'compact' }).format(item.value)}
                        </td>
                        <td className="px-3 py-2 text-right text-zinc-500">
                          {pct.toFixed(1)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-sm text-zinc-400 pb-8">Sin datos para mostrar</div>
        )}
      </div>
    </div>
  )
}
