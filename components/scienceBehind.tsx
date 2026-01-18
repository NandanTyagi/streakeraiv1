"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, CalendarDays, Eye, LineChart } from "lucide-react";

const principles = [
  {
    id: 1,
    title: "Observation frame",
    tag: "Method",
    description:
      "The system captures daily evidence without ranking it, so the signal is readable over time.",
    icon: <Eye size={28} className="text-[var(--accent-color)]" />,
  },
  {
    id: 2,
    title: "Layered time",
    tag: "Method",
    description:
      "Days, weeks, and months are aligned into a single ledger so continuity has shape.",
    icon: <Layers size={28} className="text-[var(--accent-color)]" />,
  },
  {
    id: 3,
    title: "Calendar discipline",
    tag: "Method",
    description:
      "The grid makes absence visible without shame, emphasizing accuracy over reward.",
    icon: <CalendarDays size={28} className="text-[var(--accent-color)]" />,
  },
  {
    id: 4,
    title: "Measured accumulation",
    tag: "Method",
    description:
      "Streaks are a consequence of repeated practice, not a target in themselves.",
    icon: <LineChart size={28} className="text-[var(--accent-color)]" />,
  },
  {
    id: 5,
    title: "Reference texts",
    tag: "Sources",
    description:
      "Systems literature informs the structure, but the ledger stays neutral.",
    icon: <BookOpen size={28} className="text-[var(--accent-color)]" />,
  },
];

export default function ScienceBehind() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h2 className="mb-8 sm:text-center text-2xl font-semibold text-[var(--ink)]">
        The structure beneath the surface
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {principles.map((principle) => (
          <Card
            key={principle.id}
            className="w-full h-full rounded-lg border border-[var(--surface-border)] bg-[var(--paper-veil)] shadow-none"
          >
            <CardHeader className="text-center">
              <Badge className="mb-4 bg-transparent text-[var(--ink-soft)] border border-[var(--surface-border)] text-xs font-medium px-3 py-1 rounded-full max-w-[fit-content] mx-auto">
                {principle.tag}
              </Badge>
              <div className="mb-4 flex justify-center">{principle.icon}</div>
              <CardTitle className="text-base font-semibold text-[var(--ink)]">
                {principle.title}
              </CardTitle>
              <CardDescription className="text-sm text-[var(--ink-soft)] leading-relaxed">
                {principle.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
