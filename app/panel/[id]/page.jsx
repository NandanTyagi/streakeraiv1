"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchPanelById from "@/utils/v2/fetchPanelById";
import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
import Nav from "@/components/Nav";

const PanelPage = () => {
  const { id } = useParams();
  const [panel, setPanel] = useState(null);
  const currentYear = useParams("year");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPanel = async () => {
      if (!id) {
        return;
      }
      try {
        const panel = await fetchPanelById(id);
        setPanel(panel);
        console.log("panel", panel);
      } catch (error) {
        console.error("Panel operation failed", error);
      } finally {
        setLoading(false);
      }
    };
    if (panel === null) {
      fetchPanel();
    }
  }, [id, panel]);

  return (
    <>
      <Nav isNav={false} isHistory />
      <main className="overflowY-scroll relative z-1">
        <StreakerHistoryGrid
          board={panel}
          cells={panel && panel.history.find((h) => h.year === currentYear)}
        />
      </main>
    </>
  );
};

export default PanelPage;
