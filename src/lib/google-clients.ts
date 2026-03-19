import { BigQuery } from '@google-cloud/bigquery'
import { GoogleGenerativeAI } from '@google/generative-ai'

// 1. Cliente para BigQuery
export const bigquery = new BigQuery({
  projectId: process.env.BIGQUERY_PROJECT_ID,
  credentials: {
    client_email: process.env.BIGQUERY_CLIENT_EMAIL,
    // Reemplazamos los saltos de línea literales \n por saltos reales para que el certificado sea válido
    private_key: process.env.BIGQUERY_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
})

// 2. Cliente para Gemini (Generative AI)
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
