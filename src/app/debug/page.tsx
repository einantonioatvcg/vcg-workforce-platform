export default function DebugPage() {
  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold">Ruta de Diagnóstico VCG</h1>
      <p className="mt-4">Si puedes ver esto, el despliegue de Vercel y el ruteo básico están funcionando correctamente.</p>
      <ul className="mt-6 space-y-2 list-disc ml-6">
        <li>Estado: OK</li>
        <li>Rutas cargadas: /debug</li>
        <li>Próximo paso: Verificar variables de entorno de Supabase y BigQuery.</li>
      </ul>
    </div>
  )
}
