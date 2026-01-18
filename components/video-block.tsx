'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function VideoBlock() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[40vh] flex items-center justify-center bg-[var(--paper)]">
      <div className="min-w-[100vw] w-full flex justify-center">
        <Card className="overflow-hidden border border-[var(--surface-border)] bg-[var(--paper-veil)] shadow-none">
          <CardContent className="p-0">
            <div className="h-[300px] sm:h-[300px] w-full max-w-[600px]">
              <iframe
                title="Streaker walkthrough"
                src="https://www.youtube.com/embed/NLxlXaaMsS0?si=q7oc5fZRUqc8AT1k"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full min-w-[90vw] sm:min-w-[600px]"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

