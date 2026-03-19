"use client"

import {Info} from "lucide-react"

export function DataSourceFooter() {
  return (
    <div className="mt-12 py-6 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Atribución y Fuente de Datos</p>
          <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Fuente: Encuesta Nacional de Ocupación y Empleo (ENOE), población de 15 años y más de edad de 4 trimestre del 2025. 
            Se utilizaron los datos crudos publicados por el <span className="font-semibold text-zinc-700 dark:text-zinc-300">INEGI</span>. 
            Aviso: Los datos históricos se encuentran actualmente en proceso de integración.
          </p>
        </div>
      </div>
    </div>
  )
}
