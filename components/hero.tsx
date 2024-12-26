'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[white] mb-4">Streaker.ai</h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-[white] max-w-3xl mx-auto">
          Track the things that matter to you.
        </p>
      </motion.div>
      <motion.div
        className="absolute inset-0 z-0 rounded-xl"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-multiply rounded-xl" />
        <img
          src="/streaker-bg-landscape-fade.webp"
          alt="Abstract background"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className='absolute inset-0 bg-[#330594]/70'></div>
    </section>
  )
}

