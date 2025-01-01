"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchPanelById from "@/utils/v2/fetchPanelById";
import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
import Nav from "@/components/Nav";
import Loading from "@/components/Loading";

const PanelPage = () => {
  const { id, year: currentYear } = useParams();
  const [panel, setPanel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanel = async () => {
      if (!id) return;
      try {
        const panelData = await fetchPanelById(id);
        setPanel(panelData);
        console.log("Fetched panel:", panelData);
      } catch (error) {
        console.error("Panel operation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (panel === null) {
      fetchPanel();
    }
  }, [id, panel]);

  // While loading, show a spinner or similar
  if (loading) {
    return (
      <>
        <Nav isNav={false} isHistory />
        <Loading />
      </>
    );
  }

  // If we finished loading but have no panel (e.g., no matching ID), show a fallback
  if (!panel) {
    return (
      <>
        <Nav isNav={false} isHistory />
        <p>No panel found (invalid ID or no data)</p>
      </>
    );
  }

  // Otherwise, we have a valid panel
  const historyData = panel.history?.find((h) => h.year === currentYear);

  return (
    <>
      <Nav isNav={false} isHistory />
      <main className="overflowY-scroll relative z-1">
        {/* 
          Now we know `panel` is not null, so we can safely pass it.
          Also pass the 'cells' or 'historyData' if your component uses it.
        */}
        <StreakerHistoryGrid
          board={panel}
          cells={historyData}
        />
      </main>
    </>
  );
};

export default PanelPage;


















// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import fetchPanelById from "@/utils/v2/fetchPanelById";
// import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
// import Nav from "@/components/Nav";

// const PanelPage = () => {
//   const { id } = useParams();
//   const [panel, setPanel] = useState(null);
//   const currentYear = useParams("year");
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchPanel = async () => {
//       if (!id) {
//         return;
//       }
//       try {
//         const panel = await fetchPanelById(id);
//         setPanel(panel);
//         console.log("panel", panel);
//       } catch (error) {
//         console.error("Panel operation failed", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (panel === null) {
//       fetchPanel();
//     }
//   }, [id, panel]);

//   return (
//     <>
//       <Nav isNav={false} isHistory />
//       <main className="overflowY-scroll relative z-1">
//         <StreakerHistoryGrid
//           board={panel}
//           cells={panel && panel.history.find((h) => h.year === currentYear)}
//         />
//       </main>
//     </>
//   );
// };

// export default PanelPage;
