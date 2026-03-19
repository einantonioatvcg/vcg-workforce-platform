'use client'

import { useState } from 'react'
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { type GeoDistributionRow } from '@/app/actions/dashboard'

interface GeographicChartProps {
  data: GeoDistributionRow[]
}

export function GeographicChart({ data }: GeographicChartProps) {
  const [filter, setFilter] = useState('')

  // Filtrado simple ("filtros normales")
  const filteredData = data.filter(item => 
    item.entidad.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 15) // Top 15 para visualizar cómodamente

  return (
    <div className="w-full mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Población Activa por Entidad</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Filtra y explora las entidades. (Próximamente: Integración con IA para insights dinámicos)
          </p>
        </div>
        <input
          type="text"
          placeholder="Buscar entidad..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 w-full sm:w-64 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="h-[350px] w-full">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={filteredData} margin={{ top: 0, right: 0, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.15} />
              <XAxis 
                dataKey="entidad" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#888888' }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <Tooltip 
                cursor={{ fill: 'rgba(59,130,246,0.05)' }} // primary color hover effect
                contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', backgroundColor: 'var(--background)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: number) => [new Intl.NumberFormat('es-MX').format(value), 'Fuerza Laboral']}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-zinc-500">
            No se encontraron entidades con ese filtro
          </div>
        )}
      </div>
    </div>
  )
}
