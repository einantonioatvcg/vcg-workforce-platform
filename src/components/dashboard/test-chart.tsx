'use client'

import { BarChart, Activity, Users, Globe } from 'lucide-react'
import { type GeoDistributionRow } from '@/app/actions/dashboard'
import { GeographicChart } from '@/components/dashboard/geographic-chart'

interface TestChartProps {
  data: GeoDistributionRow[]
}

export function TestChart({ data }: TestChartProps) {
  const topStats = data && data.length > 0 ? data.slice(0, 5) : [
    { entidad: 'Cargando...', total: 0 },
    { entidad: 'Cargando...', total: 0 },
    { entidad: 'Cargando...', total: 0 },
    { entidad: 'Cargando...', total: 0 },
    { entidad: 'Cargando...', total: 0 },
  ]
  
  const icons = [Globe, Users, Activity]
  const colors = ['text-blue-500', 'text-purple-500', 'text-orange-500']
  const bgs = ['bg-blue-500/10', 'bg-purple-500/10', 'bg-orange-500/10']
  return (
    <div className="w-full h-full min-h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-6 shadow-sm flex flex-col relative overflow-hidden group">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Distribución Geográfica</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Personal por regiones clave</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            +12.5% este mes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {topStats.map((stat, i) => {
          const Icon = icons[i % icons.length]
          return (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50">
              <div className={`p-3 rounded-lg ${bgs[i % bgs.length]}`}>
                <Icon className={`w-5 h-5 ${colors[i % colors.length]}`} />
              </div>
              <div className="mt-1">
                <p className="text-lg font-bold truncate">{new Intl.NumberFormat('es-MX').format(stat.total)}</p>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider truncate" title={stat.entidad}>{stat.entidad}</p>
              </div>
            </div>
          )
        })}
      </div>

      <GeographicChart data={data} />
    </div>
  )
}
