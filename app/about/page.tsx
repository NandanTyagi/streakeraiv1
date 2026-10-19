import { Metadata } from 'next'
import About from '@/components/about'

export const metadata: Metadata = {
  title: 'About Us | Streaker',
  description: 'A discipline ledger and continuity mirror.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main data-scroll-root className="about-root">
      <About />
    </main>
  )
}

