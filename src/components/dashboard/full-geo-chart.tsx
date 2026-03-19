'use client'

import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { type GeoDistributionRow } from '@/app/actions/dashboard'

interface FullGeoChartProps {
  data: GeoDistributionRow[]
}

export function FullGeoChart({ data }: FullGeoChartProps) {
  return (
    <div className="w-full mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
      <div className="mb-8">
        <h3 className="text-lg font-semibold tracking-tight">Distribución Total Multi-Estados</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Clasificación descendente horizontal de todas las entidades filtradas.
        </p>
      </div>

      <div className="h-[600px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.15} />
              <XAxis 
                type="number" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#888888' }}
                tickFormatter={(value) => new Intl.NumberFormat('es-MX', { notation: "compact", compactDisplay: "short" }).format(value)}
              />
              <YAxis 
                dataKey="entidad" 
                type="category" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#888888' }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', backgroundColor: 'var(--background)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: number) => [new Intl.NumberFormat('es-MX').format(value), 'Volumen']}
              />
              <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-zinc-500">
            No se encontraron datos geográficos con esta selección cruzada.
          </div>
        )}
      </div>
    </div>
  )
}
