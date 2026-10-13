"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap } from "lucide-react";
import StandardButton from "./v1/StandardButton";

interface AnimatedCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  btnText?: string;
  href?: string;
  newWindow?: boolean;
  tag?: string;
}

export default function AnimatedCard({
  title,
  description,
  icon,
  btnText,
  href,
  newWindow,
  tag,
}: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card
        className="w-full max-w-sm mx-auto overflow-hidden border border-[var(--surface-border)] bg-[var(--paper-veil)] shadow-none"
      >
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] flex items-center justify-center">
            {icon || <Zap size={20} className="text-[var(--accent-color)]" />}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-[var(--ink)]">
              {title}
            </CardTitle>
            {tag && <span className="text-xs text-[var(--ink-soft)]">{tag}</span>}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-[var(--ink-soft)] leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter>
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
