"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedCard from "./AnimatedCard";
import Image from "next/image";
import { Zap, BookHeartIcon } from "lucide-react";
import ScienceBehind from "./scienceBehind";

const contentItems = [
  {
    title: "Personalized Tracking",
    content: `Streaker seamlessly integrates cutting-edge technology with personal development, providing a tailored framework to empower your transformation.`,
  },
  {
    title: "Elegant Simplicity",
    content: `With its intuitive design and user-friendly interface, Streaker ensures effortless navigation and engagement for users of all backgrounds. It is simple and to the point.`,
  },
  {
    title: "Proven Methodologies",
    content: `Drawing on principles from best-selling self-improvement guides, Streaker offers strategies rooted in science to maximize your growth.`,
  },
  {
    title: "Versatile Application",
    content: `Whether for personal ambitions or professional milestones, Streaker is your all-in-one platform for comprehensive progress tracking.`,
  },
];

const scienceItems = [
  {
    title: "Step Ladders",
    content: `Break down your goals into manageable, incremental steps to build momentum and confidence.`,
  },
  // {
  //   title: "Community",
  //   content: `Leverage social support with our upcoming community features to share progress and celebrate milestones.`,
  // },
  {
    title: "Important",
    content: `Streaker aligns your habits with your personal values to ensure meaningful and lasting change.`,
  },
  {
    title: "Easy",
    content: `By simplifying habit tracking, Streaker removes barriers and makes staying consistent effortless.`,
  },
  {
    title: "Neurohacks",
    content: `Overcome mental barriers with tools designed to reshape thought patterns and sustain motivation.`,
  },
  {
    title: "Captivating",
    content: `Engaging visuals and gamified rewards make forming new habits an enjoyable process.`,
  },
  // {
  //   title: "Engrained",
  //   content: `Focus on daily actions to engrain habits into your routine for long-term success.`,
  // },
];

export default function Content() {
  return (
    <section className="py-10 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800">
      <div className="max-w-6xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid gap-10 md:grid-cols-2"
        >
          {contentItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center text-gray-700">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold mb-10 sm:text-center text-gray-800">
            The Inspiration
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {`Streaker draws inspiration from the principles and methodologies outlined in these groundbreaking books, which have shaped modern understanding of habit formation and personal growth. These books are highly recommended for those seeking to cultivate meaningful habits and achieve lasting change.`}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-10">
            <AnimatedCard
              title="The Compound Effect"
              tag="By: Darren Hardy"
              description={`Small, consistent actions lead to extraordinary results over time.`}
              icon={
                <BookHeartIcon size={48} className="text-white" />
              }
              btnText="Learn More"
              href="https://store.darrenhardy.com/collections/frontpage/products/the-compound-effect"
              newWindow
            />
            <AnimatedCard
              title="Atomic Habits"
              tag="By: James Clear"
              description={`
Build systems, not goals, to ensure long-term sustainability.`}
              icon={
                <BookHeartIcon size={48} className="text-white" />
              }
              btnText="Learn More"
              href="https://jamesclear.com/atomic-habits"
              newWindow
            />
            <AnimatedCard
              title="Stick With It"
              tag="By: Sean Young"
              description={`Stepladders, Community, and Important milestones, among others.`}
              icon={
                <BookHeartIcon size={48} className="text-white" />
              }
              btnText="Learn More"
              href="https://seanyoungphd.com/"
              newWindow
            />
          </div>
        </motion.div>
      </div>

<ScienceBehind/>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold text-muted-white mb-6">
          {`Turning Ambitions into Reality `}
        </h3>
        <p className="text-lg text-muted-white mb-6">
          {`Streaker is not just about setting goals, it’s about embedding them into daily life in a way that makes progress inevitable. The philosophy behind the app is that every person has the potential to change, but change rarely happens overnight. Real transformation lies in small, achievable steps taken every day.`}
        </p>
      </motion.div>
    </section>
  );
}

