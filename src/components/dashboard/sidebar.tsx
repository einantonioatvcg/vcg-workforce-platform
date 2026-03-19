'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, PieChart, Settings, LayoutDashboard } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Análisis Geográfico', href: '/dashboard/geo-analysis', icon: Map },
  { name: 'Reportes', href: '/dashboard/reports', icon: PieChart },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col p-4 shadow-sm">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Workforce</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
                isActive 
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-zinc-500')} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto px-2 py-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center">
             <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">AM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-zinc-500">admin@vcg.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
