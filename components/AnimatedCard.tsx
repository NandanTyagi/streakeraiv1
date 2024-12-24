"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import StandardButton from "./v1/StandardButton";

interface AnimatedCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  btnText?: string;
  href?: string;
  newWindow?: boolean;
}

export default function AnimatedCard({
  title,
  description,
  icon,
  btnText,
  href,
  newWindow,
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card
        className="w-full max-w-sm mx-auto overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="relative overflow-hidden h-40">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: isHovered ? 1.1 : 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-br from-[#330594] to-primary"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-[0] flex items-center justify-center h-full"
          >
            {icon || <Zap size={48} className="text-white" />}
          </motion.div>
        </CardHeader>
        <CardContent className="mt-4">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </CardContent>
        <CardFooter>
          {/* <Button onClick={() => {
            if (newWindow && href) {
              window.open(href, '_blank');
            } else {
              router.push(href ? href : '/');
            }
          }} className="w-full" variant={'default'}>{btnText || 'Learn more'}</Button> */}
          <StandardButton
            text={`${btnText || "Learn more"}`}
            type="pill"
            pushTo={href || "/"}
            newWindow={newWindow}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
