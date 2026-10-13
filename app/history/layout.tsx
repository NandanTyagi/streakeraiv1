export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <main className="relative">{children}</main>
    </div>
  )
}

