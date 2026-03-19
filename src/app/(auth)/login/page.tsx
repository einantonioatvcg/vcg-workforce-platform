import { login, signup } from '@/app/actions/auth'

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col space-y-1.5 pb-6">
        <h3 className="font-semibold tracking-tight text-2xl">Bienvenido a Workforce</h3>
        <p className="text-sm text-muted-foreground">
          Inicia sesión o regístrate para continuar.
        </p>
      </div>
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
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full transition-colors"
            type="submit"
          >
            Iniciar sesión
          </button>
          <button
            formAction={signup}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full transition-colors"
            type="submit"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}
