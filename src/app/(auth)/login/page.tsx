import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams
  const error = searchParams.error
  const success = searchParams.success

  return (
    <div className="w-full max-w-sm rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col space-y-1.5 pb-6">
        <h3 className="font-semibold tracking-tight text-2xl">Bienvenido a Workforce</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Introduce tus credenciales para acceder a la plataforma.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{decodeURIComponent(error)}</p>
        </div>
      )}

      {success === 'ResetEmailSent' && (
        <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p>Enlace de recuperación enviado con éxito.</p>
        </div>
      )}
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Contraseña
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id="password"
            name="password"
            required
            type="password"
          />
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <button
            formAction={login}
            className="inline-flex items-center justify-center rounded-xl text-sm font-bold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:opacity-90 h-11 w-full transition-all shadow-md"
            type="submit"
          >
            Iniciar sesión
          </button>
          
          <div className="text-center pt-2">
            <Link 
              href="/forgot-password" 
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
