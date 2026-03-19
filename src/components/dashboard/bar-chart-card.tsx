"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface BarChartCardProps {
  title: string
  description: string
  data: { name: string; value: number }[]
  color?: string
}

export function BarChartCard({ title, description, data, color = "#3b82f6" }: BarChartCardProps) {
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0)
  
  // Ordenar datos si es necesario (para salarios ya suele venir bien del BQ, pero aseguramos)
  const displayData = data.filter(d => d.value > 0)

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm flex flex-col pt-4">
      <div className="px-6 pb-2">
        <h3 className="font-semibold tracking-tight text-base sm:text-lg">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <div className="flex-1 px-4 flex flex-col justify-start min-h-[300px]">
        {displayData.length > 0 ? (
          <>
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} layout="vertical" margin={{ left: -20, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" strokeOpacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140} 
                    fontSize={10}
                    tick={{ fill: '#71717a' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '12px' }}
                    formatter={(value: number) => [new Intl.NumberFormat('es-MX').format(value), 'Fuerza Laboral']}
                  />
                  <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend as Data Table */}
            <div className="mt-4 w-full max-h-40 overflow-y-auto mb-4 border border-zinc-100 dark:border-zinc-800 rounded-lg">
              <table className="w-full text-[10px] sm:text-xs text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500">
                  <tr>
                    <th className="font-semibold px-3 py-2">Rango Salarial</th>
                    <th className="font-semibold px-3 py-2 text-right">Volumen</th>
                    <th className="font-semibold px-3 py-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {displayData.map((item) => {
                    const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0
                    return (
                      <tr key={item.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-6 py-1.5 font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-none" title={item.name}>{item.name}</td>
                        <td className="px-3 py-1.5 text-right text-zinc-600 dark:text-zinc-400">
                          {new Intl.NumberFormat('es-MX', { notation: 'compact' }).format(item.value)}
                        </td>
                        <td className="px-3 py-1.5 text-right text-zinc-500">{pct.toFixed(1)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-sm text-zinc-400 pb-8">Sin datos salariales reportados</div>
        )}
      </div>
    </div>
  )
}
