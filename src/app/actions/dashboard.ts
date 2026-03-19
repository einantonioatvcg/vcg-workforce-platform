'use server'

import { bigquery } from '@/lib/google-clients'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface GeoDistributionRow {
  entidad: string
  total: number
}

export interface GeoFilters {
  sexo?: string
  sector?: string
  nivel_instruccion?: string
  condicion_actividad?: string
  ocupacion?: string
  edad_min?: string
  edad_max?: string
  limit?: number
  groupBy?: string
  entidad_filter?: string
  municipio_filter?: string
}

export interface DashboardSummary {
  resumenNacional: number
  entidades: GeoDistributionRow[]
  educacion: { name: string, value: number }[]
  actividad: { name: string, value: number }[]
  genero: { name: string, value: number }[]
  ocupaciones: { name: string, value: number }[]
  carreras: { name: string, value: number }[]
  sectores: { name: string, value: number }[]
  formalidad: { name: string, value: number }[]
  salarios: { name: string, value: number }[]
  stats?: {
    ocupados: number
    desocupados: number
    hombres: number
    mujeres: number
  }
}

export async function getGeographicDistribution(filters?: GeoFilters): Promise<DashboardSummary> {
  let whereClauses = []
  
  if (filters?.entidad_filter) whereClauses.push(`LOWER(entidad) LIKE LOWER('%${filters.entidad_filter}%')`)
  if (filters?.municipio_filter) whereClauses.push(`LOWER(municipio) LIKE LOWER('%${filters.municipio_filter}%')`)
  if (filters?.sexo) whereClauses.push(`LOWER(sexo) LIKE LOWER('%${filters.sexo}%')`)
  if (filters?.sector) whereClauses.push(`LOWER(sector) LIKE LOWER('%${filters.sector}%')`)
  if (filters?.nivel_instruccion) whereClauses.push(`LOWER(nivel_instruccion) LIKE LOWER('%${filters.nivel_instruccion}%')`)
  
  if (filters?.condicion_actividad) {
    const actFilters = filters.condicion_actividad.split(',')
    const orConditions = []
    
    if (actFilters.includes('Formal')) orConditions.push(`tipo_empleo = 'Empleo formal'`)
    if (actFilters.includes('Informal')) orConditions.push(`tipo_empleo = 'Empleo informal'`)
    if (actFilters.includes('Ocupado')) orConditions.push(`(tipo_empleo IS NOT NULL AND tipo_empleo != 'No aplica')`)
    if (actFilters.includes('Desocupado')) orConditions.push(`(tipo_empleo = 'No aplica' AND condicion_actividad LIKE '%PEA%')`)

    if (orConditions.length > 0) {
      whereClauses.push(`(${orConditions.join(' OR ')})`)
    } else if (filters.condicion_actividad.length > 0) {
      whereClauses.push(`(1=0)`)
    }
  }

  if (filters?.ocupacion) whereClauses.push(`LOWER(ocupacion) LIKE LOWER('%${filters.ocupacion}%')`)
  
  if (filters?.edad_min) whereClauses.push(`edad >= ${parseInt(filters.edad_min)}`)
  if (filters?.edad_max) whereClauses.push(`edad <= ${parseInt(filters.edad_max)}`)

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : 'WHERE 1=1'
  
  const validGroups = ['entidad', 'municipio', 'ciudad']
  let groupColumn = filters?.groupBy || 'entidad'

  if (filters?.entidad_filter && !filters?.municipio_filter && (!filters?.groupBy || filters.groupBy === 'entidad')) {
    groupColumn = 'municipio'
  }

  const queryTotal = `SELECT SUM(factor_expansion) as total FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql}`
  const queryEntidades = `SELECT IFNULL(${groupColumn}, 'NO DEFINIDO') as entidad, SUM(factor_expansion) as total FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} GROUP BY ${groupColumn} ORDER BY total DESC LIMIT ${filters?.limit || 5}`
  const queryEducacion = `SELECT IFNULL(nivel_instruccion, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} GROUP BY name ORDER BY value DESC`
  const queryActividad = `SELECT IFNULL(condicion_actividad, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} GROUP BY name ORDER BY value DESC`
  const queryGenero = `SELECT IFNULL(sexo, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} GROUP BY name ORDER BY value DESC`
  const queryOcupacion = `SELECT IFNULL(ocupacion, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} AND ocupacion IS NOT NULL AND ocupacion != 'No aplica' GROUP BY name ORDER BY value DESC LIMIT 100`
  const queryCarrera = `SELECT IFNULL(carrera, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} AND carrera IS NOT NULL AND carrera != 'No aplica' GROUP BY name ORDER BY value DESC LIMIT 100`
  const querySectorGroup = `SELECT IFNULL(sector, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} AND sector IS NOT NULL AND sector != 'No aplica' GROUP BY name ORDER BY value DESC LIMIT 100`
  const queryFormalidad = `SELECT IFNULL(tipo_empleo, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} AND tipo_empleo IS NOT NULL AND tipo_empleo != 'No aplica' GROUP BY name ORDER BY value DESC`
  const querySalarios = `SELECT IFNULL(rango_salarial, 'NO DEFINIDO') as name, SUM(factor_expansion) as value FROM \`workforce-490616.enoe.maestra_t425\` ${whereSql} AND rango_salarial IS NOT NULL AND rango_salarial != 'No aplica' GROUP BY name ORDER BY value DESC`

  try {
    const [[rowsTotal], [rowsEntidades], [rowsEducacion], [rowsActividad], [rowsGenero], [rowsOcupacion], [rowsCarrera], [rowsSector], [rowsFormalidad], [rowsSalarios]] = await Promise.all([
      bigquery.query({ query: queryTotal, location: 'US' }),
      bigquery.query({ query: queryEntidades, location: 'US' }),
      bigquery.query({ query: queryEducacion, location: 'US' }),
      bigquery.query({ query: queryActividad, location: 'US' }),
      bigquery.query({ query: queryGenero, location: 'US' }),
      bigquery.query({ query: queryOcupacion, location: 'US' }),
      bigquery.query({ query: queryCarrera, location: 'US' }),
      bigquery.query({ query: querySectorGroup, location: 'US' }),
      bigquery.query({ query: queryFormalidad, location: 'US' }),
      bigquery.query({ query: querySalarios, location: 'US' })
    ])

    const ocupados = rowsFormalidad.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0)
    const desocupadosRows = rowsActividad.find((r: any) => r.name.includes('PEA'))?.value || 0
    const realDesocupados = Math.max(0, desocupadosRows - ocupados)
    
    const hombres = rowsGenero.find((r: any) => r.name === 'Hombre')?.value || 0
    const mujeres = rowsGenero.find((r: any) => r.name === 'Mujer')?.value || 0

    return {
      resumenNacional: rowsTotal[0]?.total || 0,
      entidades: rowsEntidades as GeoDistributionRow[],
      educacion: rowsEducacion as any[],
      actividad: rowsActividad as any[],
      genero: rowsGenero as any[],
      ocupaciones: rowsOcupacion as any[],
      carreras: rowsCarrera as any[],
      sectores: rowsSector as any[],
      formalidad: rowsFormalidad as any[],
      salarios: rowsSalarios as any[],
      stats: {
        ocupados,
        desocupados: realDesocupados,
        hombres,
        mujeres
      }
    }
  } catch (error) {
    console.error('Error fetching from BigQuery:', error)
    return { 
      resumenNacional: 0, entidades: [], educacion: [], actividad: [], genero: [], ocupaciones: [], carreras: [], sectores: [], formalidad: [], salarios: [],
      stats: { ocupados: 0, desocupados: 0, hombres: 0, mujeres: 0 }
    }
  }
}

export async function generateDashboardInsight(summary: DashboardSummary): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const condensedData = {
    total: summary.resumenNacional,
    top_instruccion: summary.educacion.slice(0, 3),
    top_actividad: summary.actividad.slice(0, 3),
    top_sectores: summary.sectores.slice(0, 4),
    top_formalidad: summary.formalidad,
    top_salarios: summary.salarios.slice(0, 4)
  }

  const prompt = `
  Eres un Analista Senior de Inteligencia Laboral. Tu objetivo es generar un resumen ejecutivo táctico basado ÚNICAMENTE en los datos JSON adjuntos de la ENOE.
  
  REGLAS DE SEGURIDAD (CANDADO ANTI-ALUCINACIÓN):
  1. SI UN DATO NO ESTÁ EN EL JSON, NO LO INVENTES. No generes porcentajes, nombres o categorías que no aparezcan aquí.
  2. Si los volúmenes son muy bajos para una conclusión sólida, menciónalo como una limitación.
  3. No menciones ninguna institución, empresa o persona que no figure en los datos.
  4. Mantén un tono factual, seco y corporativo. Responde en español de México.
  
  ESTRUCTURA REQUERIDA (2 PÁRRAFOS):
  - Párrafo 1 (Fuerza y Género): Analiza la composición por nivel educativo y cómo se distribuye el género. Menciona si hay alguna brecha notable.
  - Párrafo 2 (Mercado y Economía): Analiza la salud del segmento (Formalidad vs Salarios). Identifica la moda salarial y si predomina la informalidad.
  
  Datos: ${JSON.stringify(condensedData)}
  `

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Error generating AI insight:', error)
    return "No se pudo generar el resumen automático en este momento."
  }
}

export async function getDistinctEntidades(): Promise<string[]> {
  const query = `SELECT DISTINCT entidad FROM \`workforce-490616.enoe.maestra_t425\` WHERE entidad IS NOT NULL ORDER BY entidad ASC`
  try {
    const [rows] = await bigquery.query({ query, location: 'US' })
    return rows.map((r: any) => r.entidad)
  } catch (error) {
    console.error('Error fetching entidades:', error)
    return []
  }
}

export async function getDistinctSectores(): Promise<string[]> {
  const query = `
    SELECT DISTINCT sector 
    FROM \`workforce-490616.enoe.maestra_t425\` 
    WHERE sector IS NOT NULL AND sector NOT IN ('No aplica', 'No especificado')
    ORDER BY sector ASC
  `
  try {
    const [rows] = await bigquery.query({ query, location: 'US' })
    return rows.map((r: any) => r.sector)
  } catch (error) {
    console.error('Error fetching sectores:', error)
    return []
  }
}

export async function getDistinctMunicipios(entidad: string): Promise<string[]> {
  if (!entidad) return []
  const query = `
    SELECT DISTINCT municipio 
    FROM \`workforce-490616.enoe.maestra_t425\` 
    WHERE municipio IS NOT NULL AND LOWER(entidad) = LOWER(@entidad) 
    ORDER BY municipio ASC
  `
  try {
    const [rows] = await bigquery.query({
      query,
      location: 'US',
      params: { entidad }
    })
    return rows.map((r: any) => r.municipio)
  } catch (error) {
    console.error('Error fetching municipios:', error)
    return []
  }
}
