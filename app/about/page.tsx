import { Metadata } from 'next'
import About from '@/components/about'

export const metadata: Metadata = {
  title: 'About Us | Our Company',
  description: 'Learn more about our company, our mission, and our team.',
}

export default function AboutPage() {
  return <About />
}

