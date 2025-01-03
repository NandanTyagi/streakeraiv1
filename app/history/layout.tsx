export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background overflow-auto pb-[82px]">
      <main className="">{children}</main>
    </div>
  )
}

