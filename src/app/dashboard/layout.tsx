import { Sidebar } from '@/components/dashboard/sidebar'
import { AICommandCenter } from '@/components/dashboard/ai-command-center'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-50 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
      <AICommandCenter />
    </div>
  )
}
