"use client";

import React, { useContext, useMemo, Suspense, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppContext } from "@/context/appContext";
import dayjs from "dayjs";
import { ArrowLeftIcon } from "lucide-react";
import Loading from "@/components/Loading";
import { calculateHabitStats, statsPeriod } from "@/utils/habitStats";


import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardLoading = () => (
  <div className="flex justify-center items-center h-screen">
    <Loading />
    <p className="ml-4 text-lg font-semibold">Loading Dashboard...</p>
  </div>
);

const Dashboard = () => {
  const router = useRouter();
  const { currentHistoryPanel } = useContext(AppContext);
  useEffect(() => { if (!currentHistoryPanel) router.push("/history"); }, [currentHistoryPanel, router]);
  // ========== UPDATED columnStats logic ==========
  const columnStats = useMemo(() => calculateHabitStats(currentHistoryPanel), [currentHistoryPanel]);

  // ====== Prepare Data for each column's Bar Chart ======
  const barchartDataAndOptionsArray = useMemo(() => {
    return columnStats.map((col) => {
      const barChartData = {
        labels: ["Done", "Missed", "Unreviewed"],
        datasets: [
          {
            label: col.headerName,
            data: [col.isDone, col.missed, col.unreviewed],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)", // Done
              "rgba(255, 99, 132, 0.6)", // Missed
              "rgba(153, 102, 255, 0.6)", // Unreviewed
            ],
          },
        ],
      };

      const barChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      };

      return { barChartData, barChartOptions };
    });
  }, [columnStats]);

  // ====== Prepare Data for the combined Bar Chart (Activity Overview) ======
  const barChartData = useMemo(() => {
    return {
      labels: columnStats.map((col) => col.headerName),
      datasets: [
        {
          label: "Done",
          data: columnStats.map((col) => col.isDone),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Missed",
          data: columnStats.map((col) => col.missed),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "Unreviewed",
          data: columnStats.map((col) => col.unreviewed),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
        {
          label: "Hit Rate",
          data: columnStats.map((col) => (parseFloat(col.hitRate) || 0)),
          backgroundColor: "rgba(255, 206, 86, 0.6)",
          type: "line",
          borderColor: "rgba(255, 206, 86, 1)",
          yAxisID: "y2",
        },
      ],
    };
  }, [columnStats]);

  const barChartOptions = useMemo(() => {
    return {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
        y2: {
          beginAtZero: true,
          position: "right",
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
  }, []);

  // ====== Prepare Data for the combined Line Chart (Streak Trends) ======
  const lineChartData = useMemo(() => ({
    labels: Array.from({ length: statsPeriod(currentHistoryPanel).days }, (_, i) => i + 1),
    datasets: columnStats.map((col, index) => ({
      label: col.headerName, data: col.trend,
      borderColor: `hsl(${(index * 360) / columnStats.length}, 70%, 50%)`,
      backgroundColor: "transparent", tension: 0.3,
    })),
  }), [columnStats, currentHistoryPanel]);

  useEffect(() => {
    console.log("Column Stats Updated:", columnStats);
    console.log("Line Chart Data:", lineChartData);
  }, [columnStats, lineChartData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-[calc(100vh-78px)] sm:h-[calc(100vh-82px)] bg-[var(--paper)] p-8 overflow-auto"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ArrowLeftIcon
          size={24}
          className="absolute top-4 left-2 cursor-pointer"
          onClick={() => window.history.back()}
        />
      </motion.div>
      {/* Page Title */}
      <motion.h1
        className="text-3xl font-extrabold text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        History Dashboard
      </motion.h1>

      {/* Goal Heading */}
      <motion.h2
        className="text-2xl font-bold text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {currentHistoryPanel?.goalToAchieve}
      </motion.h2>
      <motion.h3
        className="text-xl font-bold text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {currentHistoryPanel?.year} {currentHistoryPanel?.month}
      </motion.h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {columnStats.map((col, i) => (
          <motion.div
            key={col.colNr}
            className="p-6 bg-[var(--paper-veil)] border border-[var(--surface-border)] rounded-lg flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: col.colNr * 0.1 }}
          >
            <h3 className="font-bold text-lg text-center mb-4">
              {col.headerName}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-4 relative">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  <div className="text-sm border border-[var(--surface-border)] bg-[var(--success-veil)] p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-semibold">
                    <p className="text-xl text-[var(--success)]">{col.isDone}</p>
                    <p className="text-[var(--ink)]">Done</p>
                  </div>
                  <div className="text-sm border border-[var(--surface-border)] bg-[var(--danger-veil)] p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-semibold">
                    <p className="text-xl text-[var(--danger)]">{col.missed}</p>
                    <p className="text-[var(--ink)]">Missed</p>
                  </div>
                  <div className="text-sm border border-[var(--surface-border)] bg-[var(--success-veil)] p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-semibold">
                    <p className="text-xl text-[var(--success)]">{col.longestStreak}</p>
                    <p className="text-[var(--ink)]" title="Longest consecutive run in this month">Top Streak</p>
                  </div>
                  <div className="text-sm border border-[var(--surface-border)] bg-[var(--paper-veil)] p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-semibold text-[var(--ink)]">
                    <p className="text-xl">{col.unreviewed}</p>
                    <p>Unreviewed</p>
                  </div>
                  <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[0.8rem] border border-[var(--surface-border)] bg-[var(--paper-veil)] p-2 rounded-full w-20 h-20 flex flex-col justify-center items-center font-semibold text-[var(--ink)]">
                    <p>{col.hitRate}</p>
                    <p>Hit Rate</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {/* Per-Column Bar Chart */}
                {barchartDataAndOptionsArray[i] && (
                  <Bar
                    data={barchartDataAndOptionsArray[i].barChartData}
                    options={barchartDataAndOptionsArray[i].barChartOptions}
                  />
                )}

                {/* Per-Column Line Chart */}
                {lineChartData?.datasets && lineChartData?.datasets[i] && (
                  <Line
                    data={{
                      labels: lineChartData.labels,
                      datasets: [lineChartData.datasets[i]],
                    }}
                    options={{
                      responsive: true,
                      animation: { duration: 2000 },
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true,},
                        x: {
                          type: 'linear',
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="comments">
                <AccordionTrigger className="bg-[var(--paper-veil)] border border-[var(--surface-border)] text-[var(--ink)] py-2 px-4 rounded-lg focus:outline-none">
                  Notes
                </AccordionTrigger>
                <AccordionContent className="mt-4 bg-[var(--paper-veil)] rounded-lg p-4 border border-[var(--surface-border)]">
                  {col.comments.length > 0 ? (
                    col.comments.map((commentObj, index) => (
                      <p
                        key={index}
                        className="text-sm text-[var(--ink)] border-b border-[var(--surface-border)] py-2"
                      >
                        <span className="font-semibold mr-2">
                          {commentObj.date}:
                        </span>
                        {commentObj.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--ink-soft)]">No notes available.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        ))}
      </div>

      {/* Bottom Charts */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4">
            Activity Overview
          </h2>
          <Bar data={barChartData} options={barChartOptions} />
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4">
            Streak Trends
          </h2>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              animation: { duration: 2000 },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function DashboardWrapper() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <div className="min-h-screen overflow-x-hidden overflow-y-auto pb-20">
        <Dashboard />
      </div>
    </Suspense>
  );
}
