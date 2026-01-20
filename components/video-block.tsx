'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function VideoBlock() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[40vh] flex items-center justify-center bg-[var(--paper)]">
      <div className="w-full flex justify-center">
        <Card className="w-full max-w-3xl overflow-hidden border border-[var(--surface-border)] bg-[var(--paper-veil)] shadow-none">
          <CardContent className="p-0">
            <div className="aspect-video w-full">
              <iframe
                title="Streaker walkthrough"
                src="https://www.youtube.com/embed/NLxlXaaMsS0?si=q7oc5fZRUqc8AT1k"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

