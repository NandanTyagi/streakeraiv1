"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedCard from "./AnimatedCard";
import Image from "next/image";

const contentItems = [
  {
    title: "Personalized tracking",
    content: `StreakerAi innovative approach marries technology with personal growth, offering a dynamic framework designed to support your transformation.`,
  },
  {
    title: "Simplicity at its core",
    content: `The platform is intuitive and user-friendly, making it easy to track your progress and stay motivated no matter your background. `,
  },
  {
    title: "Science-backed strategies",
    content: `Streaker.ai is grounded in solid theoretical principles from two of the most influential books in self-improvement:`,
  },
  {
    title: "Multi-purpose use",
    content: `StreakerAi is a versatile tool that can be used for personal or professional development, offering a wide range of applications.`,
  },
];

export default function Content() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2"
        >
          {contentItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">The Story</h2>
          <p className="text-lg text-muted-white mb-6">
            {`The power of repetition is immense. Small, daily actions culminate
            into significant transformations, leading you closer to your
            aspirations. StreakerAi provides a framework to support you on the
            journey of improvement and goal achievement.`}
          </p>

          <p className="text-lg text-muted-white mb-6">
            {`Streaker.ai is grounded in solid theoretical principles from two of the most influential books in self-improvement:`}
          </p>

          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* <h1 className="text-4xl font-bold text-center mb-12 text-white">
                  Features
                </h1> */}
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                <AnimatedCard
                  title="The Compound Effect"
                  description="Darren HardyHardy’s philosophy on the power of small, consistent actions over time is a core principle of Streaker.ai. By following small habits daily, users witness how consistency breeds success and leads to significant improvement."
                  icon={
                    <Image
                      src="/the-compound-effect.png"
                      className="rounded-lg"
                      fill
                      alt="the compound effect"
                    />
                  }
                  btnText="Expolore"
                  href="https://store.darrenhardy.com/collections/frontpage/products/the-compound-effect?_gl=1*1qahhkh*_gcl_au*MTM5MjA3Nzk1NC4xNzM0NDc2MDY4*_ga*MTY3OTYzNTg5NS4xNzM0NDc2MDY3*_ga_TLRGHBVSZ7*MTczNDQ3NjA2Ny4xLjEuMTczNDQ3NjEwMy4yNC4wLjA.*_ga_K5Q92SJZ4M*MTczNDQ3NjA2OC4xLjEuMTczNDQ3NjEwMy4wLjAuMA..&_ga=2.258302602.1842553765.1734476069-1679635895.1734476067"
                />
                <AnimatedCard
                  title="Atomic Habits"
                  description="James Clear’s concept that each habit we perform is like a “vote” for the person we want to become is central to Streaker.ai. Building new habits on top of existing ones. By linking new behaviors to established routines, it is easier to incorporate them into daily life."
                  icon={
                    <Image
                      src="/atomic-habits.png"
                      className="rounded-lg"
                      fill
                      alt="atomic habits"
                    />
                  }
                  btnText="Expolore"
                  href="https://jamesclear.com/atomic-habits"
                />
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          {/* <h2 className="text-3xl font-bold mb-8 text-center">The Story</h2> */}

          <h3 className="text-xl font-bold text-muted-white mb-6">
            {`Turning Ambitions into Reality `}
          </h3>
          <p className="text-lg text-muted-white mb-6">
            {`Streaker.ai is not just about setting goals; it’s about embedding them into daily life in a way that makes progress inevitable. The philosophy behind the app is that every person has the potential to change, but change rarely happens overnight. Real transformation lies in small, achievable steps taken every day.`}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
