'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, FilterX } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { getDistinctEntidades, getDistinctMunicipios, getDistinctSectores } from '@/app/actions/dashboard'

export function DashboardFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Estados locales
  const [localEdadMin, setLocalEdadMin] = useState(searchParams.get('edad_min') || '')
  const [localEdadMax, setLocalEdadMax] = useState(searchParams.get('edad_max') || '')
  
  // Listados remotos
  const [entidades, setEntidades] = useState<string[]>([])
  const [municipios, setMunicipios] = useState<string[]>([])
  const [sectores, setSectores] = useState<string[]>([])
  const [isLoadingMuns, setIsLoadingMuns] = useState(false)

  useEffect(() => {
    setLocalEdadMin(searchParams.get('edad_min') || '')
    setLocalEdadMax(searchParams.get('edad_max') || '')
  }, [searchParams])

  // Carga inicial de catálogos
  useEffect(() => {
    getDistinctEntidades().then(setEntidades)
    getDistinctSectores().then(setSectores)
  }, [])

  // Carga reactiva de municipios al cambiar la entidad filtrada
  useEffect(() => {
    const entidadActual = searchParams.get('entidad_filter')
    if (entidadActual) {
      setIsLoadingMuns(true)
      getDistinctMunicipios(entidadActual).then(muns => {
        setMunicipios(muns)
        setIsLoadingMuns(false)
      })
    } else {
      setMunicipios([])
    }
  }, [searchParams.get('entidad_filter')])

  // Selectores inmediatos
  const onChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const onChangeEntidad = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('entidad_filter', value)
    else params.delete('entidad_filter')
    
    // Al cambiar la entidad padre, se invalida el municipio seleccionado
    params.delete('municipio_filter')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Text inputs usando debounce
  const handleDebouncedInput = (key: string, val: string) => {
    if (key === 'edad_min') setLocalEdadMin(val)
    if (key === 'edad_max') setLocalEdadMax(val)

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      if (val.length === 0 || val.length >= 1) {
        const url = new URL(window.location.href)
        if (val) url.searchParams.set(key, val)
        else url.searchParams.delete(key)
        router.push(url.pathname + url.search, { scroll: false })
      }
    }, 600)
  }

  const clearFilters = () => {
    setLocalEdadMin('')
    setLocalEdadMax('')
    router.push('?', { scroll: false })
  }

  return (
    <div suppressHydrationWarning className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6 space-y-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
          <Search className="w-4 h-4 text-primary" /> Segmentación del Workforce
        </h3>
        <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
          <FilterX className="w-3 h-3" /> Limpiar filtros
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Sexo */}
        <select 
          suppressHydrationWarning
          value={searchParams.get('sexo') || ''}
          onChange={(e) => onChange('sexo', e.target.value)}
          className="h-10 px-3 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="">👤 Todos los géneros</option>
          <option value="Hombre">Hombres</option>
          <option value="Mujer">Mujeres</option>
        </select>

        {/* Nivel de Instrucción */}
        <select 
          suppressHydrationWarning
          value={searchParams.get('nivel_instruccion') || ''}
          onChange={(e) => onChange('nivel_instruccion', e.target.value)}
          className="h-10 px-3 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="">🎓 Todas las escolaridades</option>
          <option value="Primaria">Primaria</option>
          <option value="Secundaria">Secundaria</option>
          <option value="Medio">Medio Superior</option>
          <option value="Superior">Superior / Universidad</option>
        </select>

        {/* Mapeos Geográficos Libres (Ahora Selects DB) */}
        <select 
          suppressHydrationWarning
          value={searchParams.get('entidad_filter') || ''}
          onChange={(e) => onChangeEntidad(e.target.value)}
          className="h-10 px-3 w-full text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-1 focus:ring-primary focus:outline-none col-span-2 md:col-span-1 shadow-sm"
        >
          <option value="">🔍 Estado (Todos)</option>
          {entidades.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        <select 
          suppressHydrationWarning
          value={searchParams.get('municipio_filter') || ''}
          onChange={(e) => onChange('municipio_filter', e.target.value)}
          disabled={!searchParams.get('entidad_filter') || isLoadingMuns}
          className="h-10 px-3 w-full text-xs font-medium disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-1 focus:ring-primary focus:outline-none col-span-2 md:col-span-1 shadow-sm"
        >
          <option value="">{isLoadingMuns ? 'Cargando...' : '🔍 Municipio (Todos)'}</option>
          {municipios.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Sector */}
        <select 
          suppressHydrationWarning
          value={searchParams.get('sector') || ''}
          onChange={(e) => onChange('sector', e.target.value)}
          className="h-10 px-3 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-1 focus:ring-primary focus:outline-none col-span-2 md:col-span-1 shadow-sm"
        >
          <option value="">🏢 Todos los sectores</option>
          {sectores.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Rango de Edad */}
        <input 
          suppressHydrationWarning
          type="number"
          placeholder="Edad Min."
          value={localEdadMin}
          onChange={(e) => handleDebouncedInput('edad_min', e.target.value)}
          className="h-10 px-3 w-full text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-1 focus:ring-primary focus:outline-none"
        />

        <input 
          suppressHydrationWarning
          type="number"
          placeholder="Edad Max."
          value={localEdadMax}
          onChange={(e) => handleDebouncedInput('edad_max', e.target.value)}
          className="h-10 px-3 w-full text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Multichecks Actividad Laboral */}
      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Filtros de Actividad Formaildad/Informalidad:</span>
        {[
          { label: 'Formal', value: 'Formal' },
          { label: 'Informal', value: 'Informal' },
          { label: 'Ocupados Genéricos', value: 'Ocupado' },
          { label: 'Sin Empleo / Desocupados', value: 'Desocupado' },
        ].map(opt => {
           const defaultAllOn = ['Formal', 'Informal', 'Ocupado', 'Desocupado'];
           const paramVal = searchParams.get('condicion_actividad');
           const activeVals = paramVal ? paramVal.split(',') : defaultAllOn;
             
           const isChecked = activeVals.includes(opt.value);

           const toggle = () => {
             let newVals = [...activeVals];
             if (newVals.includes(opt.value)) {
               newVals = newVals.filter(v => v !== opt.value);
             } else {
               newVals.push(opt.value);
             }

             if (newVals.length === 4 || newVals.length === 0) {
               // Si todos quedan activos (o la persona deshabilita el último), se reinicia el param en URL.
               onChange('condicion_actividad', '');
             } else {
               onChange('condicion_actividad', newVals.join(','));
             }
           };

           return (
             <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
               <input 
                 type="checkbox" 
                 checked={isChecked} 
                 onChange={toggle} 
                 className="rounded border-zinc-300 text-primary focus:ring-primary h-3.5 w-3.5"
               />
               <span className="text-xs text-zinc-600 dark:text-zinc-400">{opt.label}</span>
             </label>
           );
        })}
      </div>
    </div>
  )
}
