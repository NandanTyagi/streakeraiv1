"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchPanelById from "@/utils/v2/fetchPanelById";
import StreakerHistoryGrid from "@/components/v1/StreakerHistoryGrid";
import Nav from "@/components/Nav";
import Loading from "@/components/Loading";

const PanelPage = () => {
  const params = useParams();
  // Sometimes useParams() is an object with { id: string, year: string }
  // Confirm how you've set up your routes.
  const { id, year: currentYear } = params || {};
  
  const [panel, setPanel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log the ID and year to confirm they’re correct in production
    console.log("PanelPage -> id:", id);
    console.log("PanelPage -> year:", currentYear);

    const fetchPanel = async () => {
      if (!id) {
        console.warn("No 'id' available, cannot fetchPanelById.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching panel by ID:", id);
        const fetchedPanel = await fetchPanelById(id);
        console.log("Fetched panel data:", fetchedPanel);

        setPanel(fetchedPanel);
      } catch (error) {
        console.error("Panel operation failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (panel === null) {
      fetchPanel();
    }
  }, [id, currentYear, panel]);

  if (loading) {
    return (
      <>
        <Nav isNav={false} isHistory />
        <Loading />
      </>
    );
  }

  // If there's no panel after we've finished loading
  if (!panel) {
    return (
      <>
        <Nav isNav={false} isHistory />
        <p>No panel found (invalid ID or no data)</p>
      </>
    );
  }

  const historyData = panel.history?.find((h) => h.year === currentYear);

  return (
    <>
      <Nav isNav={false} isHistory />
      <main className="overflowY-scroll relative z-1">
        <StreakerHistoryGrid board={panel} cells={historyData} />
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
