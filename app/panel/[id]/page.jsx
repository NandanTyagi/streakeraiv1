"use client";
import { useEffect, useState, useContext } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { AppContext } from "@/context/appContext";


import fetchPanelById from "@/utils/v2/fetchPanelById";

import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
import Nav from "@/components/Nav";
import Loading from "@/components/Loading";

const PanelPage = () => {
  const { currentHistoryPanel } = useContext(AppContext);
  const searchParams = useSearchParams();
  const { id } = useParams();
  const currentYear = searchParams.get("year");
  const currentMonth = searchParams.get("month");

  const [panel, setPanel] = useState(currentHistoryPanel);
  const [loading, setLoading] = useState(false);
  const [localHistoryCells, setLocalHistoryCells] = useState(currentHistoryPanel?.cells || []);

  // 1) Refetch whenever `id` changes
  useEffect(() => {
    if (!id) {
      // If there's no ID at all, skip fetching but leave loading = false
      console.warn("No ID provided. Skipping fetch...");
      setPanel(null);
      setLocalHistoryCells([]);
      return;
    }

    const fetchPanel = async () => {
      setLoading(true); // <— Turn loading on at start
      try {
        const fetchedPanel = await fetchPanelById(id);
        setPanel(fetchedPanel);
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
    if (panel?.history) {
      const historyEntry = panel.history.find(
        (h) => h.year === currentYear && h.month === currentMonth
      );
      // setLocalHistoryCells(historyEntry?.cells || []);
    }
  }, [panel, currentYear, currentMonth]);

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
  if (!panel) {
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
          <StreakerHistoryGrid board={panel} cells={localHistoryCells} />
        )}
      </main>
    </>
  );
};

export default PanelPage;
