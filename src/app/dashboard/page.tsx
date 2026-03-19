import { TestChart } from '@/components/dashboard/test-chart'
import { getGeographicDistribution } from '@/app/actions/dashboard'
import { DashboardFilters } from '@/components/dashboard/dashboard-filters'

import { DoughnutChartCard } from '@/components/dashboard/pie-chart-card'
import { TopListCard } from '@/components/dashboard/top-list-card'
import { BarChartCard } from '@/components/dashboard/bar-chart-card'
import { DashboardInsight } from '@/components/dashboard/dashboard-insight'
import { QuickStatsCard } from '@/components/dashboard/quick-stats-card'
import { DataSourceFooter } from '@/components/dashboard/data-source-footer'

export default async function DashboardHome(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams
  const geoData = await getGeographicDistribution({
    sexo: searchParams.sexo,
    sector: searchParams.sector,
    nivel_instruccion: searchParams.nivel_instruccion,
    condicion_actividad: searchParams.condicion_actividad,
    ocupacion: searchParams.ocupacion,
    edad_min: searchParams.edad_min,
    edad_max: searchParams.edad_max,
    entidad_filter: searchParams.entidad_filter,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Fuerza Laboral (ENOE)</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Nivel Nacional con desglose interactivo.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Universo Filtrado</p>
          <p className="text-4xl font-extrabold text-primary">{new Intl.NumberFormat('es-MX').format(geoData.resumenNacional)}</p>
        </div>
      </div>
      
      <DashboardFilters />
      <QuickStatsCard stats={geoData.stats} />
      <DashboardInsight data={geoData} />

      {/* Row Analítico 1: Distribución Geográfica */}
      <div className="mb-6">
        <TestChart data={geoData.entidades} />
      </div>

      {/* Row Analítico 2: Composición Demográfica y Laboral */}
      <h2 className="text-xl font-bold tracking-tight mt-8 mb-4">Perfil Nacional Demográfico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DoughnutChartCard 
          title="Nivel de Instrucción" 
          description="Acreditación académica."
          data={geoData.educacion} 
          colors={['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e']}
        />
        <DoughnutChartCard 
          title="Formalidad Laboral" 
          description="Distribución Formal vs Informal."
          data={geoData.formalidad} 
          colors={['#10b981', '#f59e0b', '#64748b']}
        />
        <DoughnutChartCard 
          title="Ocupación Principal" 
          description="Top roles detectados."
          data={geoData.ocupaciones} 
          colors={['#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#0ea5e9']}
          maxSlices={8}
        />
        <BarChartCard 
          title="Rango Salarial (Ingresos)" 
          description="Distribución mensual por salario mínimo."
          data={geoData.salarios}
          color="#10b981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopListCard 
          title="Sectores Económicos Paginados" 
          description="Ramas de actividad con mayor volumen de trabajadores."
          data={geoData.sectores} 
        />
        <TopListCard 
          title="Top Carreras y Profesiones" 
          description="Especialidades académicas (Top 100 con paginación)."
          data={geoData.carreras} 
        />
      </div>

      <DataSourceFooter />
    </div>
  )
}
