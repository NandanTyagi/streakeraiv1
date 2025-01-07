"use client";

import React, { useContext, useMemo, Suspense, useEffect } from "react";
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

  // ========== UPDATED columnStats logic ==========
  const columnStats = useMemo(() => {
    // Early return if board or habit names aren't loaded
    if (!board?.cells || !board?.habitsNames) return [];

    // Number of days in current month up to today's date
    const currentDay = dayjs().date(); // e.g., 30 if today is the 30th
    // Number of habits (columns)
    const numberOfHabits = board.habitsNames.length;

    // Prepare structures to hold totals/streaks for each column
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
      columnStreaks[colNr] = {
        longestStreak: 0,
        currentStreak: 0,
      };
    }

    // Iterate over each day from 1..currentDay for each habit
    for (let day = 1; day <= currentDay; day++) {
      for (let colNr = 1; colNr <= numberOfHabits; colNr++) {
        // Attempt to find a matching cell
        const cell = board.cells.find((c) => c.rowNr === day && c.colNr === colNr);

        if(!cell) {
          // If no cell is found, increment unreviewed
          columnTotals[colNr].unreviewed++;
        }

        if (cell && cell.isDone === false && cell.isClear === true) {
          // No cell => user hasn't interacted => unreviewed
          columnTotals[colNr].unreviewed++;
        } else {
          // Build a date string for any comment
          const cellDate = dayjs()
            .year(dayjs().year())
            .month(dayjs().month())
            .date(day)
            .format("MMM D, YYYY");

          if (cell && cell.isDone) {
            columnTotals[colNr].isDone++;
            columnStreaks[colNr].currentStreak++;
            // Update longest streak if needed
            if (
              columnStreaks[colNr].currentStreak >
              columnStreaks[colNr].longestStreak
            ) {
              columnStreaks[colNr].longestStreak =
                columnStreaks[colNr].currentStreak;
            }
          } else {
            // If cell is explicitly cleared, increment isClear
            if (cell && cell.isClear) {
              columnTotals[colNr].isClear++;
            } else if (cell && !cell.isClear) {
              // Otherwise, mark it as missed
              columnTotals[colNr].missed++;
            }
            // Missed or isClear => reset current streak
            columnStreaks[colNr].currentStreak = 0;
          }

          // Push comments if any
          if (cell && cell.comment) {
            columnTotals[colNr].comments.push({
              text: cell.comment,
              date: cellDate,
            });
          }
        }
      }
    }

    // Convert columnTotals into an array for rendering
    return Object.entries(columnTotals).map(([col, stats]) => {
      const colNr = Number(col);

      // "Hit Rate": ratio of isDone to (isDone + missed)
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
  const lineChartData = useMemo(() => {
    // Label the X axis as 1..n days in the current month
    const totalDays = dayjs().daysInMonth();
    const labels = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Build a dataset for each column/habit
    const datasets = columnStats.map((col, index) => {
      const currentDay = dayjs().date();
      // Filter the board cells for matching colNr and day <= currentDay
      const cellsForColumn =
        board?.cells
          ?.filter((cell) => cell.colNr === col.colNr)
          .filter((cell) => cell.rowNr <= currentDay) || [];

      // Convert isDone into 1 or 0 for each day that has a cell
      // If a day has no cell, you could consider it 0 or skip it
      // (Implement as needed for your chart’s logic)
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8 pb-20"
    >
      {/* Page Title */}
      <motion.h1
        className="text-3xl font-extrabold text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Dashboard
      </motion.h1>

      {/* Goal Heading */}
      <motion.h2
        className="text-2xl font-bold text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {board?.goalToAchieve}
      </motion.h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {columnStats.map((col, i) => (
          <motion.div
            key={col.colNr}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform duration-300 flex flex-col justify-center items-center"
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
                  <div className="text-sm border bg-green-50 p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-bold">
                    <p className="text-xl">{col.isDone}</p>
                    <p>Done</p>
                  </div>
                  <div className="text-sm border bg-red-50 p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-bold">
                    <p className="text-xl">{col.missed}</p>
                    <p>Missed</p>
                  </div>
                  <div className="text-sm border bg-green-50 p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-bold">
                    <p className="text-xl">{col.longestStreak}</p>
                    <p>Top Streak</p>
                  </div>
                  <div className="text-sm border bg-gray-50 p-2 rounded-lg w-full h-full flex flex-col justify-center items-center font-bold">
                    <p className="text-xl">{col.unreviewed}</p>
                    <p>Unreviewed</p>
                  </div>
                  <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[0.8rem] border bg-yellow-50 p-2 rounded-full w-20 h-20 flex flex-col justify-center items-center font-bold">
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
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="comments">
                <AccordionTrigger className="bg-gradient-to-br from-primary to-[#330594] text-white py-2 px-4 rounded-lg focus:outline-none">
                  Notes
                </AccordionTrigger>
                <AccordionContent className="mt-4 bg-gray-100 rounded-lg p-4">
                  {col.comments.length > 0 ? (
                    col.comments.map((commentObj, index) => (
                      <p
                        key={index}
                        className="text-sm text-gray-700 border-b py-2"
                      >
                        <span className="font-semibold mr-2">
                          {commentObj.date}:
                        </span>
                        {commentObj.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No notes available.</p>
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
