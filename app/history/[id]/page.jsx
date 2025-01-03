"use client";
import { use, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";

import fetchPanelById from "@/utils/v2/fetchPanelById";

import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
import Nav from "@/components/Nav";
import Loading from "@/components/Loading";

const PanelPage = () => {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const currentYear = searchParams.get("year");
  const currentMonth = searchParams.get("month");
  const currentDays = searchParams.get("days");

  const [currentHistoryPanel, setCurrentHistoryPanel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localHistoryCells, setLocalHistoryCells] = useState([]);

  // 1) Refetch whenever `id` changes
  useEffect(() => {
    if (!id) {
      // If there's no ID at all, skip fetching but leave loading = false
      console.warn("No ID provided. Skipping fetch...");
      setCurrentHistoryPanel(null);
      setLocalHistoryCells([]);
      return;
    }

    const fetchPanel = async () => {
      setLoading(true); // <— Turn loading on at start
      try {
        const fetchedPanel = await fetchPanelById(id);
        setCurrentHistoryPanel(fetchedPanel);
        console.log("Fetched panel:", fetchedPanel);
      } catch (error) {
        console.error("Error fetching panel by ID:", error);
        // Optionally show an error UI here
      } finally {
        setLoading(false); // <— Turn loading off at end
      }
    };

    fetchPanel();
  }, [id]);

  // 2) Once the panel is fetched or year/month changes,
  //    find the correct history entry and set `localHistoryCells`.
  useEffect(() => {
    if (currentHistoryPanel?.history) {
      const historyEntry = currentHistoryPanel.history.find(
        (h) => h.year === currentYear && h.month === currentMonth
      );
      setLocalHistoryCells(historyEntry?.cells || []);
    }
  }, [currentHistoryPanel, currentYear, currentMonth]);

  // Set the main cells from the history entry
  useEffect(() => {
    if (currentHistoryPanel?.history) {
      const historyEntry = currentHistoryPanel.history.find(
        (h) => h.year === currentYear && h.month === currentMonth
      );
      setCurrentHistoryPanel((prev) => ({
        ...prev,
        cells: historyEntry?.cells || [],
      }));
    }
  }, []);

  // While loading, show a spinner
  if (loading) {
    return (
      <>
        <Nav isNav={false} isHistory />
        <Loading />
      </>
    );
  }

  // If we finished loading and still no panel => Show no-data message
  if (!currentHistoryPanel) {
    return (
      <>
        <Nav isNav={false} isHistory />
        <p>No panel found (invalid ID or no data)</p>
      </>
    );
  }

  return (
    <>
      <Nav isNav={false} isHistory />
      <main className="overflowY-scroll relative z-1">
        {localHistoryCells.length > 0 && (
          <StreakerHistoryGrid
            board={currentHistoryPanel}
            cells={localHistoryCells}
            month={currentMonth?.substring(0, 3)}
            daysFromProps={currentDays}
          />
        )}
      </main>
    </>
  );
};

export default PanelPage;
