'use server'

import { bigquery, genAI } from '@/lib/google-clients'

const SCHEMA = `
Tabla: \`workforce-490616.enoe.maestra_t425\`
Columnas principales y tipos:
- control, vivienda, hogar, mudanza, num_persona, factor_expansion (Enteros)
- entidad_id, municipio_id, ciudad_id (Enteros)
- entidad, municipio, ciudad (Strings)
- edad (Entero)
- sexo (String)
- condicion_actividad (String)
- nivel_instruccion_id (Entero), nivel_instruccion (String)
- carrera_id (Entero), carrera (String)
- ocupacion_id (Entero), ocupacion (String)
- sector_id (Entero), sector (String)

IMPORTANTÍSIMO:
1. Para saber el impacto poblacional, volumen real de personas o el tamaño de la fuerza laboral, NUNCA uses COUNT(). SIEMPRE debes usar \`SUM(factor_expansion)\`.
2. Asume que todos los registros de la tabla ya pertenecen a la fuerza laboral. NO agregues filtros restrictivos \`WHERE\` sobre condiciones o sectores (como \`condicion_actividad IN (...)\`) a menos que el usuario lo pida explícitamente. Si debes filtrar por strings, prefiere usar \`LOWER()\` y \`LIKE '%texto%'\` para evitar fallas exactas.
`

export async function askAgent(message: string, history: { role: string, text: string }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // 1. Text to SQL
    const sqlPrompt = `
      Eres un experto analista de datos que escribe código de BigQuery Google SQL optimizado.
      Esquema de la tabla:
      ${SCHEMA}
      
      Historial reciente de la conversación:
      ${history.slice(-3).map(h => `${h.role}: ${h.text}`).join('\n')}

      El usuario acaba de preguntar/decir: "${message}"

      - Si la pregunta del usuario es estrictamente una duda casual o un saludo que no requiere base de datos, devuelve textualmente: NO_SQL
      - PERO, si es algo analítico (ej. ¿cuántos hay?, ¿dónde están?, compara x con y), averigua qué consulta SQL responde esto.
      
      Devuelve SÓLO el query adentro de bloques \`\`\`sql ... \`\`\`. No saludes ni expliques qué hiciste, solo el bloque \`\`\`sql. 
      Utiliza \`workforce-490616.enoe.maestra_t425\` como la tabla from.
    `

    const rawResponse = await model.generateContent(sqlPrompt)
    let sqlText = rawResponse.response.text().trim()
    
    const sqlMatch = sqlText.match(/```sql\n?([\s\S]*?)\n?```/)
    let sqlQuery = sqlMatch ? sqlMatch[1].trim() : sqlText.replace(/```sql|```/g, '').trim()

    // 2. Comprobar si fue conversacional y no requiere DB
    if (sqlQuery === "NO_SQL" || sqlQuery.length < 10) {
      const basicPrompt = `Responde amablemente a este usuario dentro de un sistema SaaS B2B de inteligencia de Workforce. Mensaje: ${message}`
      const fallback = await model.generateContent(basicPrompt)
      return { text: fallback.response.text(), type: 'conversation' }
    }

    // 3. Consultamos BigQuery usando la query generada por el agente
    let data = []
    try {
      const [rows] = await bigquery.query({ query: sqlQuery, location: 'US' })
      data = rows
    } catch (dbError: any) {
      console.error("Agent SQL Error:", dbError)
      return { text: `Intenté revisar esa información, pero la estructura de mi consulta falló: ${dbError.message}`, type: 'error' }
    }

    // 4. Transformar JSON en lenguaje natural para el usuario
    const finalPrompt = `
      Pregunta original del directivo: "${message}"
      
      Query ejecutada (para tu información): ${sqlQuery}
      
      Data devuelta (JSON - primeros resultados): 
      ${JSON.stringify(data.slice(0, 10))}

      Genera una respuesta profesional como consultor analítico en Workforce (en un lenguaje muy conciso y digerible) brindando la respuesta exacta basada en la Data que se te envía. Si la "Data devuelta" está vacía, dile que no encontraste registros para ese cruce. Omite tecnicismos de código, resume los números. Opcionalmente puedes usar formato markdown bold/listas.
    `
    const dataResponse = await model.generateContent(finalPrompt)
    
    return { 
      text: dataResponse.response.text(), 
      type: 'data',
      sql: sqlQuery
    }
  } catch (err: any) {
    console.error("AI Action Error: ", err)
    return { text: "Hubo un error contactando a mi cerebro en la nube (Gemini API Error). Revisa tus tokens.", type: 'error' }
  }
}
