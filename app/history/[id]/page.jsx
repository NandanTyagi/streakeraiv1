"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { AppContext } from "@/context/appContext";
import fetchPanelById from "@/utils/v2/fetchPanelById";
import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
import Nav from "@/components/Nav";
import Loading from "@/components/Loading";

const PanelPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();

  const currentYear = searchParams.get("year");
  const currentMonth = searchParams.get("month");
  const indexParam = searchParams.get("index");
  const historyIndex = indexParam ? parseInt(indexParam, 10) : 0;

  const { currentHistoryPanel, setCurrentHistoryPanel } = useContext(AppContext);

  // Initialize state with context value (if available)
  const [panel, setPanel] = useState(currentHistoryPanel);
  const [loading, setLoading] = useState(false);
  const [localHistoryCells, setLocalHistoryCells] = useState(
    currentHistoryPanel?.cells || []
  );
  const [historyItem, setHistoryItem] = useState(null);

  // Redirect back to "/history" if there's no currentHistoryPanel.
  useEffect(() => {
    if (!currentHistoryPanel) {
      router.push("/history");
    }
  }, [currentHistoryPanel, router]);

  // Fetch the panel whenever the id (or history index) changes.
  useEffect(() => {
    if (!id) {
      console.warn("No ID provided. Skipping fetch...");
      setPanel(null);
      setLocalHistoryCells([]);
      return;
    }

    const fetchPanel = async () => {
      setLoading(true);
      try {
        const fetchedPanel = await fetchPanelById(id);
        setPanel(fetchedPanel);
        console.log("Fetched panel:", fetchedPanel);
        if (fetchedPanel?.history) {
          // Use the provided index (converted to number) to update the context.
          setCurrentHistoryPanel(fetchedPanel.history[historyIndex]);
        }
      } catch (error) {
        console.error("Error fetching panel by ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanel();
  }, [id, historyIndex, setCurrentHistoryPanel]);

  // When the panel (or the selected year/month) changes,
  // find the matching history entry and update local cells.
  useEffect(() => {
    if (!panel?.history) {
      console.warn("No history found in panel. Skipping...");
      return;
    }

    const matchedHistoryEntry = panel.history.find(
      (entry) => entry.year === currentYear && entry.month === currentMonth
    );

    setHistoryItem(matchedHistoryEntry);
    setLocalHistoryCells(matchedHistoryEntry?.cells || []);
  }, [panel, currentYear, currentMonth]);

  // Show a loading spinner while fetching data.
  if (loading) {
    return (
      <>
        <Nav isNav={false} isHistory />
        <Loading />
      </>
    );
  }

  // If no panel is found, show a no-data message.
  if (!panel) {
    return (
      <>
        <Nav isNav={false} isHistory currentHistoryItem={null} />
        <p>No panel found (invalid ID or no data)</p>
      </>
    );
  }

  return (
    <>
      <Nav isNav={false} isHistory currentHistoryItem={historyItem} />
      <main className="overflow-y-scroll relative z-10">
        {localHistoryCells.length > 0 && (
          <StreakerHistoryGrid board={panel} cells={localHistoryCells} />
        )}
      </main>
    </>
  );
};

export default PanelPage;
