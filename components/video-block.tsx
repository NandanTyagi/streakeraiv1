'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export default function VideoBlock() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[40vh] flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="min-w-[100vw] w-full flex justify-center"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[300px] sm:h-[300px] w-full max-w-[600px]">
              <iframe
                src="https://www.youtube.com/embed/NLxlXaaMsS0?si=q7oc5fZRUqc8AT1k"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full min-w-[90vw] sm:min-w-[600px]"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

