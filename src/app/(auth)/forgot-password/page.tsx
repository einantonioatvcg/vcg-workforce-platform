import { forgotPassword } from '@/app/actions/auth'
import Link from 'next/link'
import { ArrowLeft, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

export default async function ForgotPasswordPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams
  const error = searchParams.error
  const success = searchParams.success

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl p-8">
      <div className="flex flex-col space-y-2 pb-6">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Volver al inicio
        </Link>
        <h3 className="font-bold tracking-tight text-2xl text-zinc-900 dark:text-zinc-50 text-center">Recuperar Acceso</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center px-4">
          Enviaremos un enlace a tu correo para restablecer tu contraseña.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{decodeURIComponent(error)}</p>
        </div>
      )}

      {success === 'ResetEmailSent' && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p>Enlace enviado. Por favor, revisa tu bandeja de entrada.</p>
        </div>
      )}

      <form action={forgotPassword} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="email">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              id="email"
              name="email"
              placeholder="m@example.com"
              required
              type="email"
            />
          </div>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-xl text-sm font-bold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:opacity-90 h-11 w-full transition-all shadow-md"
          type="submit"
        >
          Enviar enlace
        </button>
      </form>
    </div>
  )
}
