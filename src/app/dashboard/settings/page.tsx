import { adminCreateUser, getAdminUsers, updatePassword } from '@/app/actions/auth'
import { UserPlus, AlertCircle, CheckCircle2, Users, Shield, Calendar, Lock, Key } from 'lucide-react'
import { UserDeleteButton } from '@/components/dashboard/user-delete-button'

export default async function SettingsPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams
  const error = searchParams.error
  const success = searchParams.success

  const users = await getAdminUsers()

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Configuración</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Gestión de la plataforma y accesos del equipo.</p>
      </div>

      <div className="grid gap-6">
        {/* Gestión de Usuarios */}
        <section className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Gestión de Usuarios</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Crea nuevos accesos para tu equipo de análisis.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>Error: {decodeURIComponent(error)}</p>
            </div>
          )}

          {success === 'UserCreated' && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <p>¡Usuario creado exitosamente! Ya puede iniciar sesión.</p>
            </div>
          )}

          {success === 'PasswordUpdated' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <p>Tu contraseña ha sido actualizada correctamente.</p>
            </div>
          )}

          <form action={adminCreateUser} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="analista@vcgconsulting.mx"
                required
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="password">
                Contraseña Temporal
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Crear Usuario
            </button>
          </form>
        </section>

        {/* Listado de Usuarios */}
        <section className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
              <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Usuarios Registrados</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Lista de miembros con acceso a la plataforma.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                  <th className="pb-3 pl-2">Usuario</th>
                  <th className="pb-3">Registro / ID</th>
                  <th className="pb-3">Último Acceso</th>
                  <th className="pb-3 text-right pr-2">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                          {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                            {user.email}
                          </span>
                          <span className="text-[10px] flex items-center gap-1 text-zinc-400 italic">
                            {user.app_metadata?.claims_admin ? 'Superadmin' : 'Miembro'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(user.created_at).toLocaleDateString('es-MX')}</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        <span>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('es-MX') : 'Nunca'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <UserDeleteButton userId={user.id} userEmail={user.email || ''} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cambio de Contraseña Personal */}
        <section className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Mi Seguridad</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Actualiza tus credenciales de acceso privadas.</p>
            </div>
          </div>

          <form action={updatePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="new-password">
                Nueva Contraseña
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Actualizar Contraseña
            </button>
          </form>
        </section>

        {/* Sección Informativa */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Nota: Todos los usuarios creados tendrán acceso de lectura a los módulos de Geografía y Dashboard. 
            Asegúrate de compartir las credenciales de forma segura con los miembros autorizados de VCG Consulting.
          </p>
        </div>
      </div>
    </div>
  )
}
