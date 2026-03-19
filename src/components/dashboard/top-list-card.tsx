"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TopListCardProps {
  title: string
  description: string
  data: { name: string; value: number }[]
  className?: string
}

export function TopListCard({ title, description, data, className = "" }: TopListCardProps) {
  const [page, setPage] = useState(0)
  const pageSize = 10
  const totalPages = Math.ceil(data.length / pageSize)
  
  const displayData = data.slice(page * pageSize, (page + 1) * pageSize)
  // Utilizamos el valor máximo global absoluto para escalar las barras de la tabla uniformemente
  const maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm flex flex-col ${className}`}>
      <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center gap-4">
        <div>
          <h3 className="font-semibold tracking-tight text-base sm:text-lg">{title}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-600 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-zinc-500 min-w-[32px] text-center">
              {page + 1} / {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-600 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="p-0 overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3 font-medium text-zinc-500">#</th>
              <th className="px-6 py-3 font-medium text-zinc-500 w-1/2">Categoría</th>
              <th className="px-6 py-3 font-medium text-zinc-500 text-right">Fuerza Laboral</th>
              <th className="px-6 py-3 font-medium text-zinc-500 pl-8">Proporción Relativa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {displayData.map((item, i) => (
              <tr key={item.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-3 text-zinc-400 font-medium w-12 text-center">{(page * pageSize) + i + 1}</td>
                <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]" title={item.name}>{item.name}</td>
                <td className="px-6 py-3 text-right font-semibold text-primary">
                  {new Intl.NumberFormat('es-MX').format(item.value)}
                </td>
                <td className="px-6 py-3 pl-8">
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${(item.value / maxValue) * 100}%` }} />
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
               <tr><td colSpan={4} className="text-center p-8 text-zinc-500">No hay datos suficientes para mostrar bajo este cruce de filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
