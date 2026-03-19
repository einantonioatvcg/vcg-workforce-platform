export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 dark:bg-zinc-950">
      {children}
    </div>
  )
}
