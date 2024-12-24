"use client";

import { motion } from "framer-motion";
import Hero from "./hero";
import VideoBlock from "./video-block";
import Content from "./content";
import AnimatedCard from "@/components/AnimatedCard";
import {
  Coffee,
  Heart,
  Star,
  Target,
  Binoculars,
  BrainCircuit,
} from "lucide-react";
import Image from "next/image";
import { DashboardIcon } from "@radix-ui/react-icons";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background overflow-scroll pb-40"
    >
      <Hero />
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard
              title="Track Anything"
              description="Track anything you want, from your daily habits to your life goals."
              icon={<Target size={48} className="text-white" />}
              btnText="Start Tracking"
              href="/panel"
            />
            <AnimatedCard
              title="Stay Accountable"
              description="Get direct visual feedback on your progress to keep you motivated."
              btnText="Explore"
              href="/panel"
            />
            <AnimatedCard
              title="AI Recommendations"
              description="Get personalized recommendations based on your goals."
              icon={<BrainCircuit size={48} className="text-white rotate-90" />}
              btnText="Identify"
              href="/generategoals"
            />
          </div>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-purple-100 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center">Discover Your Dashboard</h2>
          <p className="text-lg text-gray-700 mb-10">
            Dive into the Dashboard to monitor your habits and goals. Get a
            comprehensive view of your progress with detailed statistics,
            interactive charts, and streak tracking. Whether it&apos;s daily habits
            or long-term objectives, the Dashboard keeps you informed and
            motivated.
          </p>
          <div className="flex justify-center">
            <AnimatedCard
            icon={<DashboardIcon width={48} height={48} className="text-white rotate-90" />}
              title="Explore the Dashboard"
              description="Visualize your progress and stay on top of your goals."
              btnText="Go to Dashboard"
              href="/dashboard"
            />
          </div>
        </div>
      </section>
      <Content />
      <VideoBlock />
    </motion.div>

  );
}




// "use client";

// import { motion } from "framer-motion";
// import Hero from "./hero";
// import VideoBlock from "./video-block";
// import Content from "./content";
// import AnimatedCard from "@/components/AnimatedCard";
// import {
//   Coffee,
//   Heart,
//   Star,
//   Target,
//   Binoculars,
//   BrainCircuit,
// } from "lucide-react";
// import Image from "next/image";

// export default function About() {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-background overflow-scroll pb-40"
//     >
//       <Hero />
//       <VideoBlock />
//       <section className="py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* <h1 className="text-4xl font-bold text-center mb-12 text-white">
//             Features
//           </h1> */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <AnimatedCard
//               title="Track Anything"
//               description="Track anything you want, from your daily habits to your life goals."
//               icon={<Target size={48} className="text-white" />}
//               btnText="Start Tracking"
//               href="/panel"
//             />
//             <AnimatedCard
//               title="Stay Accountable"
//               description="Get direct visual feedback on your progress to keep you motivated."
//               // icon={<Binoculars size={48} className="text-white" />}
//               btnText="Explore"
//               href="/panel"
//             />
//             <AnimatedCard
//               title="AI Recommendations"
//               description="Get personalized recommendations based on your goals."
//               icon={<BrainCircuit size={48} className="text-white rotate-90" />}
//               btnText="Identify"
//               href="/generategoals"
//             />
//           </div>
//         </div>
//       </section>
//       <Content />
//     </motion.div>
//   );
// }
