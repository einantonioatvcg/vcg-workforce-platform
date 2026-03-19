"use client"

import { useEffect, useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { DashboardSummary, generateDashboardInsight } from "@/app/actions/dashboard"

interface DashboardInsightProps {
  data: DashboardSummary
}

export function DashboardInsight({ data }: DashboardInsightProps) {
  const [insight, setInsight] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)

  const handleGenerate = async () => {
    if (data.resumenNacional > 0) {
      setIsLoading(true)
      setHasRequested(true)
      try {
        const result = await generateDashboardInsight(data)
        setInsight(result)
      } catch (err) {
        setInsight("Error al conectar con el servicio de IA. Intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Resetear estado cuando cambian los datos (filtros) para invitar a generar de nuevo
  useEffect(() => {
    setHasRequested(false)
    setInsight("")
  }, [data])

  if (data.resumenNacional === 0) return null

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 ring-offset-background transition-colors flex-1">
          <div className="mt-1 bg-primary/10 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h4 className="font-bold text-primary flex items-center gap-2">
              Análisis Inteligente (IA)
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />}
            </h4>
            
            {hasRequested ? (
              isLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-1/2" />
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 animate-in fade-in duration-700 whitespace-pre-wrap">
                  {insight}
                </p>
              )
            ) : (
              <p className="text-sm text-zinc-500 italic">Haz clic en el botón para generar un diagnóstico estratégico de los datos actuales.</p>
            )}
          </div>
        </div>

        {!hasRequested && (
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            GENERAR INSIGHTS
          </button>
        )}
      </div>
    </div>
  )
}
