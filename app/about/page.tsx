import { Metadata } from 'next'
import About from '@/components/about'

export const metadata: Metadata = {
  title: 'About Us | Streaker.ai',
  description: 'Track the things that matter to you.',
}

export default function AboutPage() {
  return <About />
}

