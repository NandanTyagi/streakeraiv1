"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedCard from "./AnimatedCard";
import Image from "next/image";

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
  {
    title: "Community",
    content: `Leverage social support with our upcoming community features to share progress and celebrate milestones.`,
  },
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
  {
    title: "Engrained",
    content: `Focus on daily actions to engrain habits into your routine for long-term success.`,
  },
];

export default function Content() {
  return (
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800">
      <div className="max-w-6xl mx-auto">
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
                  <p className="text-sm text-gray-600">
                    {item.content}
                  </p>
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
          <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
            The Story Behind Streaker.ai
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {`Streaker is built on the transformative power of daily habits. By focusing on small, consistent actions, the platform helps you unlock your full potential and achieve remarkable milestones.`}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-10">
            <AnimatedCard
              title="The Compound Effect"
              description="Harness the principles of small, consistent actions with insights from Darren Hardy’s acclaimed work 'The Compound Effect'."
              icon={
                <Image
                  src="/the-compound-effect.png"
                  className="rounded-lg"
                  fill
                  alt="The Compound Effect"
                />
              }
              btnText="Learn More"
              href="https://store.darrenhardy.com/collections/frontpage/products/the-compound-effect"
              newWindow
            />
            <AnimatedCard
              title="Atomic Habits"
              description="James Clear’s insights on habit formation are central to Streaker.ai, emphasizing the power of incremental change."
              icon={
                <Image
                  src="/atomic-habits.png"
                  className="rounded-lg"
                  fill
                  alt="Atomic Habits"
                />
              }
              btnText="Learn More"
              href="https://jamesclear.com/atomic-habits"
              newWindow
            />
            <AnimatedCard
              title="Stick With It"
              description="Sean Young’s research on habit formation provides a scientific foundation for Streaker.ai, emphasizing the importance of consistency."
              icon={
                <Image
                  src="/stick-with-it.png"
                  className="rounded-lg"
                  fill
                  alt="Stick With It"
                />
              }
              btnText="Learn More"
              href="https://seanyoungphd.com/"
              newWindow
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
            The SCIENCE Behind Streaker.ai
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {scienceItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-center text-gray-700">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <h3 className="text-xl font-bold text-muted-white mb-6">
          {`Turning Ambitions into Reality `}
        </h3>
        <p className="text-lg text-muted-white mb-6">
          {`Streaker is not just about setting goals, it’s about embedding them into daily life in a way that makes progress inevitable. The philosophy behind the app is that every person has the potential to change, but change rarely happens overnight. Real transformation lies in small, achievable steps taken every day.`}
        </p>
      </motion.div>
    </section>
  );
}







// "use client";

// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import AnimatedCard from "./AnimatedCard";
// import Image from "next/image";

// const contentItems = [
//   {
//     title: "Personalized Tracking",
//     content: `Streaker seamlessly integrates cutting-edge technology with personal development, providing a tailored framework to empower your transformation.`,
//   },
//   {
//     title: "Elegant Simplicity",
//     content: `With its intuitive design and user-friendly interface, Streaker ensures effortless navigation and engagement for users of all backgrounds. It is simple and to the point.`,
//   },
//   {
//     title: "Proven Methodologies",
//     content: `Drawing on principles from best-selling self-improvement guides, Streaker offers strategies rooted in science to maximize your growth.`,
//   },
//   {
//     title: "Versatile Application",
//     content: `Whether for personal ambitions or professional milestones, Streaker is your all-in-one platform for comprehensive progress tracking.`,
//   },
// ];

// export default function Content() {
//   return (
//     <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800">
//       <div className="max-w-6xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//           viewport={{ once: true }}
//           className="grid gap-10 md:grid-cols-2"
//         >
//           {contentItems.map((item, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.2 }}
//               viewport={{ once: true }}
//             >
//               <Card className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
//                 <CardHeader>
//                   <CardTitle className="text-xl font-semibold text-center text-gray-700">
//                     {item.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-sm text-gray-600 text-justify">
//                     {item.content}
//                   </p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           viewport={{ once: true }}
//           className="mt-20"
//         >
//           <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
//             The Story Behind Streaker.ai
//           </h2>
//           <p className="text-lg text-gray-600 mb-8 leading-relaxed">
//             {`Streaker is built on the transformative power of daily habits. By focusing on small, consistent actions, the platform helps you unlock your full potential and achieve remarkable milestones.`}
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center gap-10">
//             <AnimatedCard
//               title="The Compound Effect"
//               description="Harness the principles of small, consistent actions with insights from Darren Hardy’s acclaimed work 'The Compound Effect'."
//               icon={
//                 <Image
//                   src="/the-compound-effect.png"
//                   className="rounded-lg"
//                   fill
//                   alt="The Compound Effect"
//                 />
//               }
//               btnText="Explore More"
//               href="https://store.darrenhardy.com/collections/frontpage/products/the-compound-effect"
//               newWindow
//             />
//             <AnimatedCard
//               title="Atomic Habits"
//               description="James Clear’s insights on habit formation are central to Streaker.ai, emphasizing the power of incremental change."
//               icon={
//                 <Image
//                   src="/atomic-habits.png"
//                   className="rounded-lg"
//                   fill
//                   alt="Atomic Habits"
//                 />
//               }
//               btnText="Learn More"
//               href="https://jamesclear.com/atomic-habits"
//               newWindow
//             />
//           </div>
//         </motion.div>
//       </div>
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//         className="mt-16"
//       >


//         <h3 className="text-xl font-bold text-muted-white mb-6">
//           {`Turning Ambitions into Reality `}
//         </h3>
//         <p className="text-lg text-muted-white mb-6">
//           {`Streaker is not just about setting goals; it’s about embedding them into daily life in a way that makes progress inevitable. The philosophy behind the app is that every person has the potential to change, but change rarely happens overnight. Real transformation lies in small, achievable steps taken every day.`}
//         </p>
//       </motion.div>
//     </section>
//   );
// }

// "use client";

// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import AnimatedCard from "./AnimatedCard";
// import Image from "next/image";

// const contentItems = [
//   {
//     title: "Personalized tracking",
//     content: `StreakerAi innovative approach marries technology with personal growth, offering a dynamic framework designed to support your transformation.`,
//   },
//   {
//     title: "Simplicity at its core",
//     content: `The platform is intuitive and user-friendly, making it easy to track your progress and stay motivated no matter your background. `,
//   },
//   {
//     title: "Science-backed strategies",
//     content: `Streaker.ai is grounded in solid theoretical principles from two of the most influential books in self-improvement:`,
//   },
//   {
//     title: "Multi-purpose use",
//     content: `StreakerAi is a versatile tool that can be used for personal or professional development, offering a wide range of applications.`,
//   },
// ];

// export default function Content() {
//   return (
//     <section className="py-16 px-4 sm:px-6 lg:px-8 text-black">
//       <div className="max-w-4xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="grid gap-8 md:grid-cols-2"
//         >
//           {contentItems.map((item, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               viewport={{ once: true }}
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle>{item.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>{item.content}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="mt-16"
//         >
//           <h2 className="text-3xl font-bold mb-8 text-center">The Story</h2>
//           <p className="text-lg text-muted-white mb-6">
//             {`The power of repetition is immense. Small, daily actions culminate
//             into significant transformations, leading you closer to your
//             aspirations. StreakerAi provides a framework to support you on the
//             journey of improvement and goal achievement.`}
//           </p>

//           <p className="text-lg text-muted-white mb-6">
//             {`Streaker.ai is grounded in solid theoretical principles from two of the most influential books in self-improvement:`}
//           </p>

//           <section className="py-16 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//               {/* <h1 className="text-4xl font-bold text-center mb-12 text-white">
//                   Features
//                 </h1> */}
//               <div className="flex flex-col sm:flex-row justify-center gap-8">
//                 <AnimatedCard
//                   title="The Compound Effect"
//                   description="Darren Hardy’s philosophy on the power of small, consistent actions over time is a core principle of Streaker.ai. By following small habits daily, users witness how consistency breeds success and leads to significant improvement."
//                   icon={
//                     <Image
//                       src="/the-compound-effect.png"
//                       className="rounded-lg"
//                       fill
//                       alt="the compound effect"
//                     />
//                   }
//                   btnText="Expolore"
//                   href="https://store.darrenhardy.com/collections/frontpage/products/the-compound-effect?_gl=1*1qahhkh*_gcl_au*MTM5MjA3Nzk1NC4xNzM0NDc2MDY4*_ga*MTY3OTYzNTg5NS4xNzM0NDc2MDY3*_ga_TLRGHBVSZ7*MTczNDQ3NjA2Ny4xLjEuMTczNDQ3NjEwMy4yNC4wLjA.*_ga_K5Q92SJZ4M*MTczNDQ3NjA2OC4xLjEuMTczNDQ3NjEwMy4wLjAuMA..&_ga=2.258302602.1842553765.1734476069-1679635895.1734476067"
//                   newWindow
//                 />
//                 <AnimatedCard
//                   title="Atomic Habits"
//                   description="James Clear’s concept that each habit we perform is like a “vote” for the person we want to become is central to Streaker.ai. Building new habits on top of existing ones. By linking new behaviors to established routines, it is easier to incorporate them into daily life."
//                   icon={
//                     <Image
//                       src="/atomic-habits.png"
//                       className="rounded-lg"
//                       fill
//                       alt="atomic habits"
//                     />
//                   }
//                   btnText="Expolore"
//                   href="https://jamesclear.com/atomic-habits"
//                   newWindow
//                 />
//               </div>
//             </div>
//           </section>
//         </motion.div>
//       </div>

//       <div className="max-w-4xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="mt-16"
//         >
//           {/* <h2 className="text-3xl font-bold mb-8 text-center">The Story</h2> */}

//           <h3 className="text-xl font-bold text-muted-white mb-6">
//             {`Turning Ambitions into Reality `}
//           </h3>
//           <p className="text-lg text-muted-white mb-6">
//             {`Streaker.ai is not just about setting goals; it’s about embedding them into daily life in a way that makes progress inevitable. The philosophy behind the app is that every person has the potential to change, but change rarely happens overnight. Real transformation lies in small, achievable steps taken every day.`}
//           </p>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
