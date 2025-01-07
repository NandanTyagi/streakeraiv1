"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  Users,
  Award,
  CheckSquare,
  RotateCw,
  Settings,
  UserCheck,
  Brain,
  Repeat,
} from "lucide-react";

// Data for principles (updated copy)
const principles = [
  {
    id: 1,
    title: "Step Ladders",
    tag: "Stick With It",
    description:
      "The app breaks down big goals into small, actionable steps. Each step is tracked as a mini-milestone, helping users stay motivated by celebrating incremental progress.",
    icon: <Flag size={36} className="text-white" />,
  },
  {
    id: 2,
    title: "Community",
    tag: "Stick With It",
    description:
      "Users can join communities of like-minded individuals, share their progress, and get accountability partners to keep each other on track.",
    icon: <Users size={36} className="text-white" />,
  },
  {
    id: 3,
    title: "Important Milestones",
    tag: "Stick With It",
    description:
      "Streaker highlights key achievements within your journey, ensuring you stay focused and motivated by celebrating every milestone along the way.",
    icon: <Award size={36} className="text-white" />,
  },
  {
    id: 4,
    title: "Small, Consistent Actions",
    tag: "The Compound Effect",
    description:
      "Streaker encourages users to focus on small, daily actions that lead to long-term results. The app provides reminders and nudges to ensure consistency.",
    icon: <CheckSquare size={36} className="text-white" />,
  },
  {
    id: 5,
    title: "Momentum & Habit Tracking",
    tag: "The Compound Effect",
    description:
      "Streaker’s habit tracker visually displays progress, creating a streak of successes that motivates users to keep going—even if you miss a day.",
    icon: <RotateCw size={36} className="text-white" />,
  },
  {
    id: 6,
    title: "Behavior Change Laws",
    tag: "Atomic Habits",
    description:
      "Make it Obvious, Attractive, Easy, and Satisfying: Streaker uses cues, gamifies rewards, simplifies setup, and provides immediate feedback for every habit.",
    icon: <Settings size={36} className="text-white" />,
  },
  {
    id: 7,
    title: "Identity-Based Habits",
    tag: "Atomic Habits",
    description:
      "Streaker allows users to define their goals based on who they want to become (e.g., “I want to be a runner”), ensuring the habits align with their personal identity.",
    icon: <UserCheck size={36} className="text-white" />,
  },
  {
    id: 8,
    title: "Neuroscience",
    tag: "Neuroscience",
    description:
      "The app reinforces habits by pairing actions with positive outcomes, such as instant rewards, and uses cues to anchor habits in daily routines.",
    icon: <Brain size={36} className="text-white" />,
  },
  {
    id: 9,
    title: "Engrained Practices",
    tag: "Stick With It",
    description:
      "Streaker integrates habits into your daily schedule by offering time-blocking and routine-building tools, so habits become second nature.",
    icon: <Repeat size={36} className="text-white" />,
  },
];

// Framer Motion Variants for Animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ScienceBehind() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <motion.h1
        className="mb-8 sm:text-center text-3xl font-bold text-gray-800 mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        How Streaker.ai Implements the Science
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {principles.map((principle) => (
          <motion.div
            key={principle.id}
            className="flex flex-col items-center"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="w-full h-full rounded-lg shadow-lg p-6 text-center bg-gradient-to-br from-primary to-[#330594]">
              <CardHeader>
                {/* Tag as Badge */}
                <Badge className="mb-4 bg-gradient-to-br from-primary to-[#330594] text-xs font-medium px-4 py-1 rounded-full max-w-[fit-content]">
                  {principle.tag}
                </Badge>
                {/* Icon */}
                <div className="mb-4">{principle.icon}</div>
                {/* Title */}
                <CardTitle className="text-lg font-semibold text-white">
                  {principle.title}
                </CardTitle>
                {/* Description */}
                <CardDescription className="text-sm text-white">
                  {principle.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
