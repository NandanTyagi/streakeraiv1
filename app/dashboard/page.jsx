"use client";

import React, { useContext, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { AppContext } from "@/context/appContext"; 
import dayjs from "dayjs";
import Loading from "@/components/Loading";

// ====== 1) Import from react-chartjs-2 ======
import { Bar, Line } from "react-chartjs-2";

// ====== 2) Import from chart.js ======
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

// ====== 3) Register the chart.js elements we need ======
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

// ====== Loading Animation Component ======
const DashboardLoading = () => (
  <div className="flex justify-center items-center h-screen">
    <Loading />
    <p className="ml-4 text-lg font-semibold">Loading Dashboard...</p>
  </div>
);

const Dashboard = () => {
  const { board } = useContext(AppContext);

  // ====== Calculate Stats with useMemo ======
  const columnStats = useMemo(() => {
    // Guard clause
    if (!board?.cells || !board?.habitsNames) return [];

    // 1) Get today's day-of-month, e.g. 26 if today is the 26th
    const currentDay = dayjs().date();

    // 2) Filter out any cells that are for future days
    const filteredCells = board.cells.filter((cell) => {
      // Adjust this check if your cell object stores the day differently
      // For example, if `cell.dayIndex` starts at 1 for the first day of the month, do:
      // return cell.dayIndex <= currentDay;
      // If you store the date in some other property, change accordingly.
      return cell.rowNr <= currentDay;
    });

    const columnTotals = {};
    const columnStreaks = {};

    // 3) Use the filtered cells to build our stats
    filteredCells.forEach((cell) => {
      const column = cell.colNr;

      // Initialize if missing
      if (!columnTotals[column]) {
        columnTotals[column] = { isDone: 0, isClear: 0, missed: 0 };
        columnStreaks[column] = { longestStreak: 0, currentStreak: 0 };
      }

      // Count done vs. missed vs. clear
      if (cell.isDone) {
        columnTotals[column].isDone += 1;

        // Increase current streak
        columnStreaks[column].currentStreak += 1;
        if (
          columnStreaks[column].currentStreak >
          columnStreaks[column].longestStreak
        ) {
          columnStreaks[column].longestStreak =
            columnStreaks[column].currentStreak;
        }
      } else {
        // If not done, then either missed or unreviewed (clear)
        if (!cell.isClear) {
          columnTotals[column].missed += 1;
        }
        columnTotals[column].isClear += 1;

        // Reset current streak
        columnStreaks[column].currentStreak = 0;
      }
    });

    // Convert objects to array of stats for each column
    return Object.entries(columnTotals).map(([col, stats]) => {
      const totalAttempts = stats.isDone + stats.missed + stats.isClear;
      const hitRate =
        totalAttempts > 0
          ? ((stats.isDone / totalAttempts) * 100).toFixed(2)
          : 0;

      return {
        colNr: col,
        headerName: board.habitsNames[col - 1] || `Column ${col}`,
        ...stats,
        longestStreak: columnStreaks[col].longestStreak,
        hitRate: `${hitRate}%`,
      };
    });
  }, [board]);

  // ====== Prepare Data for Bar Chart ======
  const barChartData = {
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
        data: columnStats.map((col) => col.isClear),
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

  const barChartOptions = {
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

  // ====== Prepare Data for Line Chart ======
  const lineChartData = useMemo(() => {
    // For simplicity, label the X axis as 1..n days in the current month
    const totalDays = dayjs().daysInMonth();
    const labels = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Build a dataset for each column/habit
    const datasets = columnStats.map((col, index) => {
      // Filter cells for the current column, then only up to currentDay
      const currentDay = dayjs().date();
      const cellsForColumn = board.cells
        .filter((cell) => cell.colNr === parseInt(col.colNr, 10))
        .filter((cell) => cell.dayIndex <= currentDay);

      // If your board.cells array is not sorted by day, you may need a sort:
      // cellsForColumn.sort((a, b) => a.dayIndex - b.dayIndex);

      // Convert isDone into a 1 or 0 for each day
      const dataArray = cellsForColumn.map((cell) => (cell.isDone ? 1 : 0));

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8 pb-20"
    >
      {/* Title */}
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {columnStats.map((col) => (
          <motion.div
            key={col.colNr}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: col.colNr * 0.1 }}
          >
            <h3 className="font-bold text-lg">{col.headerName}</h3>
            <p className="text-sm">
              <strong>Done:</strong> {col.isDone}
            </p>
            <p className="text-sm">
              <strong>Missed:</strong> {col.missed}
            </p>
            <p className="text-sm">
              <strong>Longest Streak:</strong> {col.longestStreak}
            </p>
            <p className="text-sm">
              <strong>Hit Rate:</strong> {col.hitRate}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Bar Chart */}
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

        {/* Line Chart */}
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

// ====== Suspense Wrapper (Async Loading) ======
export default function DashboardWrapper() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <div className="min-h-screen overflow-x-hidden overflow-y-auto pb-20">
        <Dashboard />
      </div>
    </Suspense>
  );
}









// "use client";

// import React, { useContext, useMemo, Suspense } from "react";
// import { motion } from "framer-motion";
// import { AppContext } from "@/context/appContext"; 
// import dayjs from "dayjs";
// import Loading from "@/components/Loading";

// // ====== 1) Import from react-chartjs-2 ======
// import { Bar, Line } from "react-chartjs-2";

// // ====== 2) Import from chart.js ======
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // ====== 3) Register the chart.js elements we need ======
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // ====== Loading Animation Component ======
// const DashboardLoading = () => (
//   <div className="flex justify-center items-center h-screen">
//     <Loading />
//     <p className="ml-4 text-lg font-semibold">Loading Dashboard...</p>
//   </div>
// );

// const Dashboard = () => {
//   const { board } = useContext(AppContext);

//   // ====== Calculate Stats with useMemo ======
//   const columnStats = useMemo(() => {
//     // Guard clause
//     if (!board?.cells || !board?.habitsNames) return [];

//     const columnTotals = {};
//     const columnStreaks = {};

//     board.cells.forEach((cell) => {
//       const column = cell.colNr;

//       // Initialize if missing
//       if (!columnTotals[column]) {
//         columnTotals[column] = { isDone: 0, isClear: 0, missed: 0 };
//         columnStreaks[column] = { longestStreak: 0, currentStreak: 0 };
//       }

//       // Count done vs. missed vs. clear
//       if (cell.isDone) {
//         columnTotals[column].isDone += 1;

//         // Increase current streak
//         columnStreaks[column].currentStreak += 1;
//         if (
//           columnStreaks[column].currentStreak >
//           columnStreaks[column].longestStreak
//         ) {
//           columnStreaks[column].longestStreak =
//             columnStreaks[column].currentStreak;
//         }
//       } else {
//         // If not done, then either missed or unreviewed (clear)
//         if (!cell.isClear) {
//           columnTotals[column].missed += 1;
//         }
//         columnTotals[column].isClear += 1;

//         // Reset current streak
//         columnStreaks[column].currentStreak = 0;
//       }
//     });

//     // Convert objects to array of stats for each column
//     return Object.entries(columnTotals).map(([col, stats]) => {
//       const totalAttempts = stats.isDone + stats.missed + stats.isClear;
//       const hitRate =
//         totalAttempts > 0
//           ? ((stats.isDone / totalAttempts) * 100).toFixed(2)
//           : 0;

//       return {
//         colNr: col,
//         headerName: board.habitsNames[col - 1] || `Column ${col}`,
//         ...stats,
//         longestStreak: columnStreaks[col].longestStreak,
//         hitRate: `${hitRate}%`,
//       };
//     });
//   }, [board]);

//   // ====== Prepare Data for Bar Chart ======
//   const barChartData = {
//     labels: columnStats.map((col) => col.headerName),
//     datasets: [
//       {
//         label: "Done",
//         data: columnStats.map((col) => col.isDone),
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//       },
//       {
//         label: "Missed",
//         data: columnStats.map((col) => col.missed),
//         backgroundColor: "rgba(255, 99, 132, 0.6)",
//       },
//       {
//         label: "Unreviewed",
//         data: columnStats.map((col) => col.isClear),
//         backgroundColor: "rgba(153, 102, 255, 0.6)",
//       },
//       {
//         label: "Hit Rate",
//         data: columnStats.map((col) => parseFloat(col.hitRate)),
//         backgroundColor: "rgba(255, 206, 86, 0.6)",
//         type: "line",
//         borderColor: "rgba(255, 206, 86, 1)",
//         yAxisID: "y2",
//       },
//     ],
//   };

//   const barChartOptions = {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//       y2: {
//         beginAtZero: true,
//         position: "right",
//         grid: {
//           drawOnChartArea: false,
//         },
//       },
//     },
//   };

//   // ====== Prepare Data for Line Chart ======
//   const lineChartData = useMemo(() => {
//     // For simplicity, label the X axis as 1..n days in the current month
//     const totalDays = dayjs().daysInMonth();
//     const labels = Array.from({ length: totalDays }, (_, i) => i + 1);

//     // We build a dataset for each column/habit
//     const datasets = columnStats.map((col, index) => {
//       // Filter cells for the current column, sorted or arranged by day if needed
//       const cellsForColumn = board.cells.filter(
//         (cell) => cell.colNr === parseInt(col.colNr, 10)
//       );

//       // If your board.cells array is not sorted by day, you might need a sort here
//       // For example:
//       // cellsForColumn.sort((a, b) => a.dayIndex - b.dayIndex);

//       const dataArray = cellsForColumn.map((cell) => (cell.isDone ? 1 : 0));

//       return {
//         label: col.headerName,
//         data: dataArray,
//         borderColor: `hsl(${(index * 360) / columnStats.length}, 70%, 50%)`,
//         backgroundColor: "transparent",
//         tension: 0.3,
//       };
//     });

//     return { labels, datasets };
//   }, [columnStats, board]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.8 }}
//       className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8 pb-20"
//     >
//       {/* Title */}
//       <motion.h1
//         className="text-3xl font-extrabold text-center mb-10"
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         Dashboard
//       </motion.h1>
//       <motion.h2
//         className="text-2xl font-bold text-center mb-10"
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         {board?.goalToAchieve}
//       </motion.h2>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
//         {columnStats.map((col) => (
//           <motion.div
//             key={col.colNr}
//             className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: col.colNr * 0.1 }}
//           >
//             <h3 className="font-bold text-lg">{col.headerName}</h3>
//             <p className="text-sm">
//               <strong>Done:</strong> {col.isDone}
//             </p>
//             <p className="text-sm">
//               <strong>Missed:</strong> {col.missed}
//             </p>
//             <p className="text-sm">
//               <strong>Longest Streak:</strong> {col.longestStreak}
//             </p>
//             <p className="text-sm">
//               <strong>Hit Rate:</strong> {col.hitRate}
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="flex flex-col lg:flex-row items-center gap-8">
//         {/* Bar Chart */}
//         <motion.div
//           className="w-full lg:w-1/2"
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-2xl font-semibold text-center mb-4">
//             Activity Overview
//           </h2>
//           <Bar data={barChartData} options={barChartOptions} />
//         </motion.div>

//         {/* Line Chart */}
//         <motion.div
//           className="w-full lg:w-1/2"
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-2xl font-semibold text-center mb-4">
//             Streak Trends
//           </h2>
//           <Line
//             data={lineChartData}
//             options={{
//               responsive: true,
//               animation: { duration: 2000 },
//               scales: {
//                 y: { beginAtZero: true },
//               },
//             }}
//           />
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// // ====== Suspense Wrapper (Async Loading) ======
// export default function DashboardWrapper() {
//   return (
//     <Suspense fallback={<DashboardLoading />}>
//       <div className="min-h-screen overflow-x-hidden overflow-y-auto pb-20">
//         <Dashboard />
//       </div>
//     </Suspense>
//   );
// }
