"use client"

import { Users, Briefcase, UserCheck, UserX, Venus, Mars } from "lucide-react"

interface QuickStatsCardProps {
  stats?: {
    ocupados: number
    desocupados: number
    hombres: number
    mujeres: number
  }
}

export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  if (!stats) return null

  const totalOcupacion = stats.ocupados + stats.desocupados
  const pctOcupados = totalOcupacion > 0 ? (stats.ocupados / totalOcupacion) * 100 : 0
  const pctDesocupados = totalOcupacion > 0 ? (stats.desocupados / totalOcupacion) * 100 : 0

  const totalGenero = stats.hombres + stats.mujeres
  const pctHombres = totalGenero > 0 ? (stats.hombres / totalGenero) * 100 : 0
  const pctMujeres = totalGenero > 0 ? (stats.mujeres / totalGenero) * 100 : 0

  const format = (val: number) => new Intl.NumberFormat('es-MX', { notation: 'compact' }).format(val)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Empleo Stat */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Estatus de Empleo</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{format(stats.ocupados)}</span>
              <span className="text-xs font-semibold text-green-600 dark:text-green-500">Ocupados ({pctOcupados.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
        <div className="text-right border-l border-zinc-100 dark:border-zinc-800 pl-6">
          <p className="text-xs text-zinc-400 mb-1">Desocupados</p>
          <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">{format(stats.desocupados)}</p>
          <p className="text-[10px] text-zinc-400">{pctDesocupados.toFixed(1)}% de la PEA</p>
        </div>
      </div>

      {/* Genero Stat */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Distribución por Género</p>
            <div className="flex gap-6 mt-1">
              <div className="flex items-center gap-1.5">
                <Mars className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-sm font-bold">{pctHombres.toFixed(1)}%</span>
                <span className="text-[10px] text-zinc-400 font-medium">({format(stats.hombres)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Venus className="w-3.5 h-3.5 text-pink-500" />
                <span className="text-sm font-bold">{pctMujeres.toFixed(1)}%</span>
                <span className="text-[10px] text-zinc-400 font-medium">({format(stats.mujeres)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
