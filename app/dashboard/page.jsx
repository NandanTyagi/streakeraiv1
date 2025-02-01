"use client";

import React, { useContext, useMemo, Suspense, useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AppContext } from "@/context/appContext";
import dayjs from "dayjs";
import Loading from "@/components/Loading";
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
  const { board } = useContext(AppContext);

  // =================== Compute Column Statistics ===================
  const columnStats = useMemo(() => {
    if (!board?.cells || !board?.habitsNames) return [];

    const currentDay = dayjs().date();
    const numberOfHabits = board.habitsNames.length;

    const columnTotals = {};
    const columnStreaks = {};

    // Initialize totals and streaks for each column
    for (let colNr = 1; colNr <= numberOfHabits; colNr++) {
      columnTotals[colNr] = {
        isDone: 0,
        isClear: 0,
        missed: 0,
        unreviewed: 0,
        comments: [],
      };
      columnStreaks[colNr] = { longestStreak: 0, currentStreak: 0 };
    }

    // Iterate over each day up to the current day for each habit/column
    for (let day = 1; day <= currentDay; day++) {
      for (let colNr = 1; colNr <= numberOfHabits; colNr++) {
        const cell = board.cells.find(
          (c) => c.rowNr === day && c.colNr === colNr
        );

        if (!cell) {
          columnTotals[colNr].unreviewed++;
        }

        if (cell && cell.isDone === false && cell.isClear === true) {
          // No user interaction yet → unreviewed
          columnTotals[colNr].unreviewed++;
        } else {
          const cellDate = dayjs()
            .year(dayjs().year())
            .month(dayjs().month())
            .date(day)
            .format("MMM D, YYYY");

          if (cell && cell.isDone) {
            columnTotals[colNr].isDone++;
            columnStreaks[colNr].currentStreak++;
            if (
              columnStreaks[colNr].currentStreak >
              columnStreaks[colNr].longestStreak
            ) {
              columnStreaks[colNr].longestStreak =
                columnStreaks[colNr].currentStreak;
            }
          } else {
            if (cell && cell.isClear) {
              columnTotals[colNr].isClear++;
            } else if (cell && !cell.isClear) {
              columnTotals[colNr].missed++;
            }
            columnStreaks[colNr].currentStreak = 0;
          }

          if (cell && cell.comment) {
            columnTotals[colNr].comments.push({
              text: cell.comment,
              date: cellDate,
            });
          }
        }
      }
    }

    return Object.entries(columnTotals).map(([col, stats]) => {
      const colNr = Number(col);
      const totalAttempts = stats.isDone + stats.missed;
      const hitRate =
        totalAttempts > 0
          ? ((stats.isDone / totalAttempts) * 100).toFixed(0)
          : "0";

      return {
        colNr,
        headerName: board.habitsNames[colNr - 1] || `Column ${colNr}`,
        ...stats,
        longestStreak: columnStreaks[colNr].longestStreak,
        hitRate: `${hitRate}%`,
      };
    });
  }, [board]);

  // =================== Prepare Per-Column Bar Chart Data ===================
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
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      };

      return { barChartData, barChartOptions };
    });
  }, [columnStats]);

  // =================== Prepare Combined Bar Chart (Activity Overview) ===================
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
          data: columnStats.map((col) => parseFloat(col.hitRate)),
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
        y: { beginAtZero: true },
        y2: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
        },
      },
    };
  }, []);

  // =================== Prepare Combined Line Chart (Streak Trends) ===================
  const lineChartData = useMemo(() => {
    const totalDays = dayjs().daysInMonth();
    const labels = Array.from({ length: totalDays }, (_, i) => i + 1);

    const datasets = columnStats.map((col, index) => {
      const currentDay = dayjs().date();
      const cellsForColumn =
        board?.cells
          ?.filter((cell) => cell.colNr === col.colNr && cell.rowNr <= currentDay) ||
        [];

      const dataArray = [];
      for (let d = 1; d <= totalDays; d++) {
        const foundCell = cellsForColumn.find((cell) => cell.rowNr === d);
        dataArray.push(foundCell?.isDone ? 1 : 0);
      }

      return {
        label: col.headerName,
        data: dataArray,
        borderColor: `hsl(${(index * 360) / columnStats.length}, 70%, 50%)`,
        backgroundColor: "transparent",
        tension: 0.3,
      };
    });

    return { labels, datasets };
  }, [columnStats, board]);

  useEffect(() => {
    console.log("Column Stats Updated:", columnStats);
    console.log("Line Chart Data:", lineChartData);
  }, [columnStats, lineChartData]);

  // =================== Split Cards into Two Rows ===================
  // First row: first 3 cards; Second row: remaining cards
  const firstRowCards = columnStats.slice(0, 3);
  const secondRowCards = columnStats.slice(3);

  // ------------------- Reusable StatCard Component -------------------
  // The component displays the stat numbers and includes two accordions: one for charts and one for notes.
  const StatCard = ({
    col,
    chartIndex,
  }) => (
    <motion.div
      key={col.colNr}
      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: col.colNr * 0.1 }}
    >
      <h3 className="font-bold text-base text-center mb-2">{col.headerName}</h3>
      {/* Stat Display */}
      <div className="grid grid-cols-2 gap-1 w-full relative">
        <div className="text-sm border bg-green-50 p-2 rounded-lg flex flex-col justify-center items-center font-bold">
          <p className="text-lg">{col.isDone}</p>
          <p>Done</p>
        </div>
        <div className="text-sm border bg-red-50 p-2 rounded-lg flex flex-col justify-center items-center font-bold">
          <p className="text-lg">{col.missed}</p>
          <p>Missed</p>
        </div>
        <div className="text-sm border bg-green-50 p-2 rounded-lg flex flex-col justify-center items-center font-bold">
          <p className="text-lg">{col.longestStreak}</p>
          <p>Top Streak</p>
        </div>
        <div className="text-sm border bg-gray-50 p-2 rounded-lg flex flex-col justify-center items-center font-bold">
          <p className="text-lg">{col.unreviewed}</p>
          <p>Unreviewed</p>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs border bg-yellow-50 p-2 rounded-full w-16 h-16 flex flex-col justify-center items-center font-bold">
          <p>{col.hitRate}</p>
          <p>Hit Rate</p>
        </div>
      </div>
      {/* Accordions */}
      <div className="w-full mt-4">
        <Accordion type="single" collapsible className="w-full mb-2">
          <AccordionItem value="charts">
            <AccordionTrigger className="bg-gradient-to-br from-primary to-[#330594] text-white py-2 px-4 rounded-lg focus:outline-none">
              Charts
            </AccordionTrigger>
            <AccordionContent className="mt-4 bg-gray-100 rounded-lg p-4">
              {barchartDataAndOptionsArray[chartIndex] && (
                <Bar
                  data={barchartDataAndOptionsArray[chartIndex].barChartData}
                  options={barchartDataAndOptionsArray[chartIndex].barChartOptions}
                />
              )}
              {lineChartData?.datasets &&
                lineChartData?.datasets[chartIndex] && (
                  <Line
                    data={{
                      labels: lineChartData.labels,
                      datasets: [lineChartData.datasets[chartIndex]],
                    }}
                    options={{
                      responsive: true,
                      animation: { duration: 2000 },
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="notes">
            <AccordionTrigger className="bg-gradient-to-br from-primary to-[#330594] text-white py-2 px-4 rounded-lg focus:outline-none">
              Notes
            </AccordionTrigger>
            <AccordionContent className="mt-4 bg-gray-100 rounded-lg p-4">
              {col.comments.length > 0 ? (
                col.comments.map((commentObj, index) => (
                  <p key={index} className="text-xs text-gray-700 border-b py-1">
                    <span className="font-semibold mr-1">{commentObj.date}:</span>
                    {commentObj.text}
                  </p>
                ))
              ) : (
                <p className="text-xs text-gray-500">No notes available.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8 pb-20 relative"
    >
      <ArrowLeftIcon
        size={24}
        className="absolute top-4 left-2 cursor-pointer"
        onClick={() => window.history.back()}
      />

      {/* Page Titles */}
      <motion.h1
        className="text-3xl font-extrabold text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Dashboard
      </motion.h1>
      <motion.h2
        className="text-2xl font-bold text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {board?.goalToAchieve}
      </motion.h2>

      {/* Stat Cards - First Row (3 columns on large screens) */}
      {firstRowCards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {firstRowCards.map((col, i) => (
            <StatCard key={col.colNr} col={col} chartIndex={i} />
          ))}
        </div>
      )}

      {/* Stat Cards - Second Row (2 columns on large screens) */}
      {secondRowCards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
          {secondRowCards.map((col, i) => (
            <StatCard
              key={col.colNr}
              col={col}
              chartIndex={i + firstRowCards.length}
            />
          ))}
        </div>
      )}

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
              scales: { y: { beginAtZero: true } },
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
