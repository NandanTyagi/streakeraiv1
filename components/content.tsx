"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedCard from "./AnimatedCard";
import { BookHeartIcon } from "lucide-react";
import ScienceBehind from "./scienceBehind";

const contentItems = [
  {
    title: "A ledger, not a ladder",
    content:
      "Streaker records what was done, without ranking or applause. The record is the point.",
  },
  {
    title: "Clear surfaces",
    content:
      "The interface is quiet so the pattern can be seen. You return to the same place, and it stays still.",
  },
  {
    title: "Memory over motivation",
    content:
      "We emphasize continuity because it is durable. Motivation moves; memory endures.",
  },
  {
    title: "Time as structure",
    content:
      "Days align. Weeks align. The ledger makes time readable, so your practice has shape.",
  },
];

export default function Content() {
  return (
    <section className="py-12 px-6 sm:px-8 lg:px-12 bg-[var(--paper)] text-[var(--ink)]">
      <div className="max-w-6xl mx-auto mb-10 space-y-12">
        <div className="grid gap-6 md:grid-cols-2">
          {contentItems.map((item, index) => (
            <Card key={index} className="border border-[var(--surface-border)] bg-[var(--paper-veil)] shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[var(--ink)]">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)] mb-4 sm:text-center">
            Sources of method
          </p>
          <p className="text-base text-[var(--ink-soft)] mb-8 leading-relaxed sm:text-center">
            These works inform the structure of continuity and the language of practice.
            They are references, not prescriptions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <AnimatedCard
              title="The Compound Effect"
              tag="Darren Hardy"
              description="A study in small actions and accumulated change."
              icon={<BookHeartIcon size={32} className="text-[var(--accent-color)]" />}
              btnText="Open"
              href="https://store.darrenhardy.com/collections/frontpage/products/the-compound-effect"
              newWindow
            />
            <AnimatedCard
              title="Atomic Habits"
              tag="James Clear"
              description="Systems of repetition and the texture of daily intent."
              icon={<BookHeartIcon size={32} className="text-[var(--accent-color)]" />}
              btnText="Open"
              href="https://jamesclear.com/atomic-habits"
              newWindow
            />
            <AnimatedCard
              title="Stick With It"
              tag="Sean Young"
              description="Durability, friction, and the shape of follow-through."
              icon={<BookHeartIcon size={32} className="text-[var(--accent-color)]" />}
              btnText="Open"
              href="https://seanyoungphd.com/"
              newWindow
            />
          </div>
        </div>
      </div>
      <ScienceBehind />
      <div className="max-w-5xl mx-auto mt-16">
        <h3 className="text-xl font-semibold text-[var(--ink)] mb-4">
          Turning intention into a record
        </h3>
        <p className="text-base text-[var(--ink-soft)] leading-relaxed">
          Streaker does not push you toward a finish line. It simply keeps the
          ledger. The record becomes a quiet companion, and in time it shows the
          arc you have chosen.
        </p>
      </div>
    </section>
  );
}
