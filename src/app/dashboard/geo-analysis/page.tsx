import { DashboardFilters } from '@/components/dashboard/dashboard-filters'
import { getGeographicDistribution } from '@/app/actions/dashboard'
import { FullGeoChart } from '@/components/dashboard/full-geo-chart'
import { DoughnutChartCard } from '@/components/dashboard/pie-chart-card'
import { TopListCard } from '@/components/dashboard/top-list-card'
import { BarChartCard } from '@/components/dashboard/bar-chart-card'
import { DashboardInsight } from '@/components/dashboard/dashboard-insight'
import { QuickStatsCard } from '@/components/dashboard/quick-stats-card'
import { DataSourceFooter } from '@/components/dashboard/data-source-footer'

export default async function GeoAnalysisPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams
  const hasMunicipio = !!searchParams.municipio_filter
  
  const geoData = await getGeographicDistribution({
    sexo: searchParams.sexo,
    sector: searchParams.sector,
    nivel_instruccion: searchParams.nivel_instruccion,
    condicion_actividad: searchParams.condicion_actividad,
    ocupacion: searchParams.ocupacion,
    edad_min: searchParams.edad_min,
    edad_max: searchParams.edad_max,
    groupBy: searchParams.groupBy,
    entidad_filter: searchParams.entidad_filter,
    municipio_filter: searchParams.municipio_filter,
    limit: 50 // Traer top 50 recortes
  })
  
  const geoLabel = searchParams.groupBy === 'municipio' ? 'Municipio' : searchParams.groupBy === 'ciudad' ? 'Ciudad' : 'Entidad Federativa'

  const DemographicsPies = () => (
    <>
      <QuickStatsCard stats={geoData.stats} />
      <DashboardInsight data={geoData} />

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
          title="Ramas del Sector Económico" 
          description="Industrias ordenadas por mayor masa laboral albergada."
          data={geoData.sectores} 
        />
        <TopListCard 
          title="Top Carreras y Profesiones" 
          description="Especialidades académicas categorizadas."
          data={geoData.carreras} 
        />
      </div>
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Análisis Geográfico</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Desglose comparativo por entidad federativa y municipio.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Muestra Filtrada</p>
          <p className="text-4xl font-extrabold text-green-500 dark:text-green-400">{new Intl.NumberFormat('es-MX').format(geoData.resumenNacional)}</p>
        </div>
      </div>
      
      <DashboardFilters />

      {hasMunicipio ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 mt-4 p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
            <h2 className="text-xl font-bold tracking-tight text-primary">Perfil Demográfico Específico</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Estás visualizando exclusivamente los datos de la fuerza laboral encuestada en <strong>{searchParams.municipio_filter}</strong>.</p>
          </div>
          <DemographicsPies />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6 mb-8 mt-4">
            <div className="col-span-1">
              <FullGeoChart data={geoData.entidades} />
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight mb-4">Composición Demográfica y Laboral</h2>
          <DemographicsPies />
          
          {/* Tabla analítica detallada */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm mt-8">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300 w-16">#</th>
                  <th className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300 capitalize">{geoLabel}</th>
                  <th className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300 text-right">Fuerza Laboral Estimada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {geoData.entidades.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-3 text-zinc-500 font-medium">{i + 1}</td>
                    <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-50">{row.entidad}</td>
                    <td className="px-6 py-3 text-right text-zinc-700 dark:text-zinc-400 font-medium">{new Intl.NumberFormat('es-MX').format(row.total)}</td>
                  </tr>
                ))}
                {geoData.entidades.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                      No hay entidades registradas para este filtro geográfico.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DataSourceFooter />
    </div>
  )
}
